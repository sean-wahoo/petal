import Layout from "src/components/Layout";
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import styles from "src/styles/layouts/profile.module.scss";
import { createSSGHelpers } from "@trpc/react/ssg";
import { appRouter } from "src/server/_app";
import { prisma } from "src/utils/prisma";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "src/components/Dropdown";
import { upload } from "src/utils/bucket";
import { revalidate } from "src/utils/helpers";
import { trpc } from "src/utils/trpc";

const ProfilePage = ({
  id,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [friendStatus, setFriendStatus] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>("activity");
  const toggleRef = useRef<HTMLSpanElement>(null);
  const { data: session } = useSession();
  const imageUploadInputRef = useRef<HTMLInputElement>(null);

  const profileData = trpc.useQuery(["user.byId", { id }]);
  const friendsData = trpc.useQuery(["friend.byUserId", { id }]);

  const sendRequestMutation = trpc.useMutation(["friend.sendRequest"]);
  const removeFriendMutation = trpc.useMutation(["friend.removeFriend"]);
  const acceptRequestMutation = trpc.useMutation(["friend.acceptRequest"]);
  const updateProfileImageMutation = trpc.useMutation([
    "user.updateProfileImage",
  ]);

  const current_user_friend_data = useMemo(() => {
    return friendsData.data?.find((friend) => {
      return [friend.sender.id, friend.recipient.id].includes(
        session?.user?.id as string
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

  const sendRequest = () => {
    sendRequestMutation.mutate({
      senderUserId: session?.user?.id as string,
      recipientUserId: profileData.data?.id as string,
    });
    if (sendRequestMutation.data && sendRequestMutation.status === "success")
      setFriendStatus("currentUserSender");
    else console.error(sendRequestMutation.error);
  };

  const acceptFriend = async () => {
    acceptRequestMutation.mutate({
      friendId: current_user_friend_data?.friendId as string,
    });
    if (
      acceptRequestMutation.data &&
      acceptRequestMutation.status === "success"
    )
      setFriendStatus("accepted");
    else console.error(acceptRequestMutation.error);
  };

  const removeFriend = async () => {
    removeFriendMutation.mutate({
      friendId: current_user_friend_data?.friendId as string,
    });
    if (removeFriendMutation.data && removeFriendMutation.status === "success")
      setFriendStatus(null);
    else console.error(removeFriendMutation.error);
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
    if (session?.user?.id !== profileData.data?.id) {
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
                    `${session?.user?.id}.webp`,
                    { type: imageBlob.type }
                  );
                  let [data, error] = await upload(
                    newFile,
                    "profile_images",
                    session!.user!.id
                  );
                  updateProfileImageMutation.mutate({
                    id: data.id,
                    image: data.image,
                  });
                  if (
                    updateProfileImageMutation.data &&
                    updateProfileImageMutation.status === "success"
                  )
                    await revalidate(`/users/${profileData.data?.id}`);
                  else console.error(updateProfileImageMutation.error);
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
    <Layout title={`${profileData.data?.name} - Petal`}>
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
                profileData.data?.id === session?.user!.id
                  ? (session?.user?.image as string)
                  : (profileData.data?.image as string)
              }
            />
            <div>
              <h1 className={styles.name}>{profileData.data?.name}</h1>
              <p className={styles.tagline}>{profileData.data?.description}</p>
              {profileData.data?.id !== session?.user?.id && friend_buttons()}
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

export const getStaticProps = async (
  context: GetStaticPropsContext<{ id: string }>
) => {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: null,
  });
  const id = context.params?.id as string;
  await ssg.fetchQuery("user.byId", { id });
  await ssg.fetchQuery("friend.byUserId", { id });

  return {
    props: {
      trpcState: JSON.parse(JSON.stringify(ssg.dehydrate())),
      id,
    },
    revalidate: 60,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const userIds = await prisma.user.findMany({
    select: {
      id: true,
    },
  });
  const paths = userIds.map((x: any) => {
    return { params: { id: x.id } };
  });
  return {
    paths,
    fallback: false,
  };
};

export default ProfilePage;
