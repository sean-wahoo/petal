import Layout from "components/Layout";
import { NextPage, GetStaticPaths, GetStaticProps } from "next";
import styles from "styles/layouts/profile.module.scss";
import type { ProfilePageProps } from "lib/types";
import { getApiUrl } from "lib/utils";
import axios from "axios";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "lib/useSession";
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
  const { session, updateSession } = useSession();
  const imageUploadInputRef = useRef<HTMLInputElement>(null);

  const current_user_friend_data = useMemo(() => {
    return friends_data?.find((friend) => {
      return [friend.sender.user_id, friend.recipient.user_id].includes(
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
        if (current_user_friend_data.sender.user_id === session?.user_id)
          setFriendStatus("currentUserSender");
        if (current_user_friend_data.recipient.user_id === session?.user_id)
          setFriendStatus("currentUserRecipient");
        break;
      }
      case "accepted":
        setFriendStatus("accepted");
    }
  }, [current_user_friend_data]);

  const sendRequest = async () => {
    const [data, error] = await resolver(
      axios.post(`${getApiUrl()}/api/friends/send-request`, {
        sender_user_id: session?.user_id,
        recipient_user_id: profile_data?.user_id,
      })
    );
    if (error) console.error(error);
    if (data) {
      setFriendStatus("currentUserSender");
    }
    console.log({ data, error });
  };

  const acceptFriend = async () => {
    const [data, error] = await resolver(
      axios.post(`${getApiUrl()}/api/friends/accept-request`, {
        friend_id: current_user_friend_data?.friend_id,
      })
    );
    if (error) console.error(error);
    if (data) {
      setFriendStatus("accepted");
    }
    console.log({ data, error });
  };

  const removeFriend = async () => {
    const [data, error] = await resolver(
      axios.post(`${getApiUrl()}/api/friends/remove-friend`, {
        friend_id: current_user_friend_data?.friend_id,
      })
    );
    if (error) console.error(error);
    if (data) {
      setFriendStatus(null);
    }
    console.log({ data, error });
  };

  const friend_buttons = () => {
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
    if (session?.user_id !== profile_data?.user_id) {
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
                    const byteString = atob(newFileUrl.split(",")[1]);
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
                    session?.user_id
                  );
                  [data, error] = await resolver(
                    axios.patch(
                      `/api/users/profile-data/update-profile-image?user_id=${data.user_id}&image_url=${data.image_url}`
                    )
                  );
                  updateSession({ ...session, image_url: data.image_url });
                  await revalidate(`/users/${profile_data.user_id}`);
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
    <Layout
      session={session}
      title={`${profile_data.display_name} - Petal`}
      is_auth={true}
    >
      <main className={styles.profile_page}>
        <article className={styles.user_info}>
          <span ref={toggleRef} onClick={() => setShowDropdown(!showDropdown)}>
            <FontAwesomeIcon
              icon={faEllipsisV}
              size="2x"
              className={styles.menu_toggle}
            />
          </span>
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
                profile_data.user_id === session?.user_id
                  ? session?.image_url
                  : profile_data.image_url
              }
            />
            <div>
              <h1 className={styles.display_name}>
                {profile_data.display_name}
              </h1>
              <p className={styles.tagline}>{profile_data.tagline}</p>
              {profile_data.user_id !== session?.user_id && friend_buttons()}
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
  const { user_id }: any = context.params;
  const prisma = new PrismaClient();
  let friends_data = await prisma.friends.findMany({
    select: {
      friend_id: true,
      sender: {
        select: {
          user_id: true,
          display_name: true,
          image_url: true,
        },
      },
      recipient: {
        select: {
          user_id: true,
          display_name: true,
          image_url: true,
        },
      },
      status: true,
      created_at: true,
      updated_at: true,
    },
    where: {
      OR: [
        {
          sender_user_id: user_id as string,
        },
        {
          recipient_user_id: user_id as string,
        },
      ],
    },
  });
  let profile_data = await prisma.users.findFirst({
    select: {
      user_id: true,
      email: true,
      updated_at: true,
      created_at: true,
      image_url: true,
      display_name: true,
      date_of_birth: true,
      tagline: true,
      sender: true,
      recipient: true,
    },
    where: { user_id: user_id as string },
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
  const user_ids = await prisma.users.findMany({
    select: {
      user_id: true,
    },
  });
  const paths = user_ids.map((x: any) => {
    return { params: { user_id: x.user_id } };
  });
  prisma.$disconnect();
  return {
    paths,
    fallback: "blocking",
  };
};

export default ProfilePage;
