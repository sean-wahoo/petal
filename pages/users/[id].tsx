import Layout from "components/Layout";
import { NextPage, GetStaticPaths, GetStaticProps } from "next";
import styles from "styles/layouts/profile.module.scss";
import type { ProfilePageProps } from "lib/types";
import { getApiUrl } from "lib/utils";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "components/Dropdown";
import { resolver } from "lib/promises";
import { upload } from "lib/bucket";
import { revalidate } from "lib/utils";
import { PrismaClient } from "@prisma/client";

const ProfilePage: NextPage<ProfilePageProps> = ({
  profile_data,
  friends_data,
}) => {
  const [friendStatus, setFriendStatus] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>("activity");
  const toggleRef = useRef<HTMLSpanElement>(null);
  const { data: session } = useSession();
  const imageUploadInputRef = useRef<HTMLInputElement>(null);

  const current_user_friend_data = useMemo(() => {
    return friends_data?.find((friend) => {
      return [friend.sender.id, friend.recipient.id].includes(
        session?.user_id as string
      );
    });
  }, [session]);

  useEffect(() => {
    if (!current_user_friend_data) {
      return;
    }
    switch (current_user_friend_data.status) {
      case "sent": {
        if (current_user_friend_data.sender.id === session?.user!.id)
          setFriendStatus("currentUserSender");
        if (current_user_friend_data.recipient.id === session?.user!.id)
          setFriendStatus("currentUserRecipient");
        break;
      }
      case "accepted":
        setFriendStatus("accepted");
    }
  }, [current_user_friend_data]);

  const sendRequest = async () => {
    const [data, error] = await resolver(
      fetch(`${getApiUrl()}/api/friends/send-request`, {
        method: "POST",
        body: JSON.stringify({
          sender_user_id: session?.user_id,
          recipient_user_id: profile_data?.id,
        }),
      })
    );
    if (error) console.error(error);
    if (data) {
      setFriendStatus("currentUserSender");
    }
  };

  const acceptFriend = async () => {
    const [data, error] = await resolver(
      fetch(`${getApiUrl()}/api/friends/accept-request`, {
        method: "POST",
        body: JSON.stringify({
          friend_id: current_user_friend_data?.friendId,
        }),
      })
    );
    if (error) console.error(error);
    if (data) {
      setFriendStatus("accepted");
    }
  };

  const removeFriend = async () => {
    const [data, error] = await resolver(
      fetch(`${getApiUrl()}/api/friends/remove-friend`, {
        method: "POST",
        body: JSON.stringify({
          friend_id: current_user_friend_data?.friendId,
        }),
      })
    );
    if (error) console.error(error);
    if (data) {
      setFriendStatus(null);
    }
  };

  const friend_buttons = () => {
    if (session === null) {
      return (
        <div className={styles.friend_buttons}>
          Sign in to send a friend request!
        </div>
      );
    }
    switch (friendStatus) {
      case null: {
        return (
          <button className={styles.friend_buttons} onClick={sendRequest}>
            Send Friend Request
          </button>
        );
      }
      case "currentUserRecipient": {
        return (
          <button className={styles.friend_buttons} onClick={acceptFriend}>
            Accept Friend Request
          </button>
        );
      }
      case "currentUserSender": {
        return <p className={styles.friend_buttons}>Friend Request Pending</p>;
      }
      case "accepted": {
        return <p className={styles.friend_buttons}>You Are Friends!</p>;
      }
    }
  };
  const dropdownOptions = () => {
    if (session?.user_id !== profile_data?.id) {
      if (friendStatus === "accepted") {
        return (
          <>
            <li>Send Message</li>
            <li onClick={removeFriend}>Remove Friend</li>
          </>
        );
      }
    } else {
      return (
        <>
          <form onSubmit={(e) => e.preventDefault()}>
            <canvas id="canvas"></canvas>
            <input
              type="file"
              ref={imageUploadInputRef}
              accept="image/*"
              onChange={async (e) => {
                let file: any = e.currentTarget.files?.[0];
                const imageObjectUrl = URL.createObjectURL(file);
                const canvas: any = document.getElementById("canvas");
                const image = document.createElement("img");
                const context = canvas?.getContext("2d");
                image.onload = async () => {
                  canvas.width = image.naturalWidth;
                  canvas.height = image.naturalHeight;
                  context?.drawImage(image, 0, 0);
                  const newFileUrl = canvas.toDataURL("image/webp", 0.6);
                  const imageBlob = (() => {
                    const byteString = window.atob(newFileUrl.split(",")[1]);
                    const mimeString = newFileUrl
                      .split(",")[0]
                      .split(":")[1]
                      .split(";")[0];
                    const ab = new ArrayBuffer(byteString.length);
                    const ia = new Uint8Array(ab);
                    for (let i = 0; i < byteString.length; i++)
                      ia[i] = byteString.charCodeAt(i);

                    return new Blob([ia], { type: mimeString });
                  })();
                  const newFile: any = new File(
                    [imageBlob],
                    `${session?.user_id}.webp`,
                    { type: imageBlob.type }
                  );
                  let [data, error] = await upload(
                    newFile,
                    "profile_images",
                    session.user!.id
                  );
                  [data, error] = await resolver(
                    fetch(
                      `/api/users/profile-data/update-profile-image?user_id=${data.user_id}&image=${data.image}`,
                      {
                        method: "PATCH",
                      }
                    )
                  );
                  await revalidate(`/users/${profile_data.id}`);
                };
                image.src = imageObjectUrl;
              }}
            />
          </form>

          <li>Update Bio</li>
          <li onClick={() => imageUploadInputRef.current?.click()}>
            Change Profile Picture
          </li>
        </>
      );
    }
  };

  return (
    <Layout title={`${profile_data.name} - Petal`} is_auth={true}>
      <main className={styles.profile_page}>
        <article className={styles.user_info}>
          {session !== null && (
            <span
              ref={toggleRef}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <FontAwesomeIcon
                icon={faEllipsisV}
                size="2x"
                className={styles.menu_toggle}
              />
            </span>
          )}
          {showDropdown && (
            <Dropdown toggler={setShowDropdown} ref={toggleRef}>
              <ul>
                {dropdownOptions()}
                <li>Block</li>
                <li>Report</li>
              </ul>
            </Dropdown>
          )}
          <section>
            <Image
              className={styles.profile_image}
              width={144}
              height={144}
              src={
                profile_data.id === session?.user!.id
                  ? (session?.user.image as string)
                  : (profile_data.image as string)
              }
            />
            <div>
              <h1 className={styles.name}>{profile_data.name}</h1>
              <p className={styles.tagline}>{profile_data.description}</p>
              {profile_data.id !== session?.user_id && friend_buttons()}
            </div>
          </section>
          <ul className={styles.button_row}>
            <li
              onClick={() => setSelectedOption("activity")}
              className={selectedOption === "activity" ? styles.active : ""}
            >
              Activity
            </li>
            <li
              onClick={() => setSelectedOption("posts")}
              className={selectedOption === "posts" ? styles.active : ""}
            >
              Posts
            </li>
            <li
              onClick={() => setSelectedOption("friends")}
              className={selectedOption === "friends" ? styles.active : ""}
            >
              Friends
            </li>
          </ul>
        </article>
      </main>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { id }: any = context.params;
  const prisma = new PrismaClient();
  let friends_data = await prisma.friend.findMany({
    select: {
      friendId: true,
      sender: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      recipient: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      status: true,
      createdAt: true,
      updatedAt: true,
    },
    where: {
      OR: [
        {
          senderUserId: id as string,
        },
        {
          recipientUserId: id as string,
        },
      ],
    },
  });
  let profile_data = await prisma.user.findFirst({
    select: {
      id: true,
      email: true,
      updatedAt: true,
      createdAt: true,
      image: true,
      name: true,
      dateOfBirth: true,
      description: true,
      sender: true,
      recipient: true,
    },
    where: { id: id as string },
  });
  friends_data = JSON.parse(JSON.stringify(friends_data));
  profile_data = JSON.parse(JSON.stringify(profile_data));
  prisma.$disconnect();
  return {
    props: { profile_data, friends_data },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const prisma = new PrismaClient();
  const user_ids = await prisma.user.findMany({
    select: {
      id: true,
    },
  });
  const paths = user_ids.map((x: any) => {
    return { params: { id: x.id } };
  });
  prisma.$disconnect();
  return {
    paths,
    fallback: "blocking",
  };
};

export default ProfilePage;
