import Layout from "components/Layout";
import { NextPage, GetStaticPaths, GetStaticProps } from "next";
import styles from "styles/layouts/profile.module.scss";
import type { ProfilePageProps, SessionData } from "lib/types";
import { getApiUrl } from "lib/utils";
import axios from "axios";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "lib/useSession";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "components/Dropdown";
import { resolver } from "lib/promises";

const ProfilePage: NextPage<ProfilePageProps> = ({ profile_data, friends_data }) => {
  const [friendStatus, setFriendStatus] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const [selectedOption, setSelectedOption] = useState<string>('activity');
  const toggleRef = useRef<HTMLSpanElement>(null)
  const { session, updateSession } = useSession();
  const imageUploadInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const current_user_friend_data = useMemo(() => {
    return friends_data?.find(friend => {
      return [friend.sender.user_id, friend.recipient.user_id].includes(session?.user_id as string);
    })
  }, [session])

  useEffect(() => {
    if (!current_user_friend_data) {
      return
    }
    switch (current_user_friend_data.status) {
      case 'sent': {
        if (current_user_friend_data.sender.user_id === session?.user_id) setFriendStatus('currentUserSender')
        if (current_user_friend_data.recipient.user_id === session?.user_id) setFriendStatus('currentUserRecipient')
        break;
      }
      case 'accepted': setFriendStatus('accepted')
    }
  }, [current_user_friend_data])

  const sendRequest = async () => {
    const [data, error] = await resolver(axios.post(`${getApiUrl()}/api/friends/send-request`, {
      sender_user_id: session?.user_id,
      recipient_user_id: profile_data?.user_id
    }))
    if (error) console.error(error)
    if (data) {
      setFriendStatus('currentUserSender')
    }
    console.log({ data, error })
  }

  const acceptFriend = async () => {
    const [data, error] = await resolver(axios.post(`${getApiUrl()}/api/friends/accept-request`, {
      friend_id: current_user_friend_data?.friend_id
    }))
    if (error) console.error(error)
    if (data) {
      setFriendStatus('accepted')
    }
    console.log({ data, error })
  }

  const removeFriend = async () => {
    const [data, error] = await resolver(axios.post(`${getApiUrl()}/api/friends/remove-friend`, {
      friend_id: current_user_friend_data?.friend_id
    }))
    if (error) console.error(error)
    if (data) {
      setFriendStatus(null)
    }
    console.log({ data, error })
  }

  const friend_buttons = () => {
    switch (friendStatus) {
      case null: {
        return (
          <button className={styles.friend_buttons} onClick={sendRequest}>
            Send Friend Request
          </button>
        )
      }
      case 'currentUserRecipient': {
        return (
          <button className={styles.friend_buttons} onClick={acceptFriend}>
            Accept Friend Request
          </button>
        )
      }
      case 'currentUserSender': {
        return (
          <p className={styles.friend_buttons}>
            Friend Request Pending
          </p>
        )
      }
      case 'accepted': {
        return (
          <p className={styles.friend_buttons}>
            You Are Friends!
          </p>
        )
      }
    }
  }
  const dropdownOptions = () => {
    if (session?.user_id !== profile_data?.user_id) {
      if (friendStatus === "accepted") {
        return <>
          <li>
            Send Message
          </li>
          <li onClick={removeFriend}>
            Remove Friend
          </li>
        </>
      }
    }
    else {
      return <>
        <form
          onSubmit={e => e.preventDefault()}
        >
          <input
            type="file"
            ref={imageUploadInputRef}
            accept="image/*"
            onChange={async e => {
              let file: any = e.currentTarget.files?.[0]
              // sharp(buffer).toFile(`${session?.user_id}`, (e, i) => console.log({ e, i }))
              const p = new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = e => {
                  resolve(e.target?.result)
                }
                reader.onerror = e => {
                  reject(e)
                }
                reader.readAsText(file as any);
              })
              const buffer: any = await p;
              console.log({ buffer })
              const formData = new FormData()
              console.log(file.data)
              formData.append('file', file)
              // formData.append(
              //   "filename",
              //   `${session?.user_id}-${file.name.replace(/[^\x00-\x7F]/g, "")}`
              // );
              // console.log({ buffer, bufferFrom: Buffer.from(buffer)})
              // p.then(async (dataUrl: any) => {
              const [data, error] = await resolver(axios.post(`/api/users/profile-data/update-profile-image?user_id=${session?.user_id}`, formData, { headers: {/*  'Content-Type': 'multipart/form-data' */}}))
              console.log({ data, error })
              // const body = new FormData();
              // console.log(e.currentTarget.files)
              // file = URL.createObjectURL(file);
              //
              // body.append('file', URL.createObjectURL(file as any), fileName: )
              // const [data, error] = await resolver(axios.post(`/api/users/profile-data/update-profile-image?user_id=${session?.user_id}`, body, { headers: { 'Content-Type': 'multipart/form-data' } }))
              // console.log({ data, error })
              // const file = e.target.files[0];
              // const reader = new FileReader()
              // reader.onload = async event => {
              //   const buffer = event.target?.result
              //     headers: {
              //       'Content-Type': 'application/octet-stream'
              //     }
              //   }))
              //   console.log({ data, error })
              //   const newCacheKey = await updateSession({ ...session, ...data })
              //   console.log({ newCacheKey })
              // }
              // reader.onerror = error => console.error(error)
              // reader.readAsBinaryString(file)
              // console.log({ data: e.target })
              // console.log({ file })
              // const [data, error] = await resolver(axios.post('/api/users/profile-data/update-profile-image', file))
              // console.log({ data, error })
              // const [data, error] = await upload(
              //   file,
              //   "profile_images",
              //   profile_data?.user_id
              // );
              // if (error || !data) {
              //   console.log("whoops", { error });
              //   return;
              // }
              // const cache_key = await updateSession({
              //   ...session,
              //   image_url: data.image_url,
              // });
              // window.location.reload()
            }}
          />
        </form>

        <li>
          Update Bio
        </li>
        <li onClick={() => imageUploadInputRef.current?.click()}>
          Change Profile Picture
        </li>
      </>
    }
  }

  return (
    <Layout
      session={session}
      title={`${profile_data.display_name} - Petal`}
      is_auth={true}
    >
      <main className={styles.profile_page}>
        <article className={styles.user_info}>
          <span ref={toggleRef} onClick={() => setShowDropdown(!showDropdown)}>
            <FontAwesomeIcon icon={faEllipsisV} size="2x" className={styles.menu_toggle} />
          </span>
          {showDropdown && <Dropdown toggler={setShowDropdown} ref={toggleRef}>
            <ul>
              {dropdownOptions()}
              <li>
                Block
              </li>
              <li>
                Report
              </li>
            </ul>
          </Dropdown>}
          <section>
            <Image
              className={styles.profile_image}
              width={144}
              height={144}
              src={profile_data.image_url}
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
            <li onClick={() => setSelectedOption('activity')} className={selectedOption === 'activity' ? styles.active : ''}>
              Activity
            </li>
            <li onClick={() => setSelectedOption('posts')} className={selectedOption === 'posts' ? styles.active : ''}>
              Posts
            </li>
            <li onClick={() => setSelectedOption('friends')} className={selectedOption === 'friends' ? styles.active : ''}>
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
  let { data: profile_data } = await axios.get(
    `${getApiUrl()}/api/users/profile-data/${user_id}`
  );
  let { data: friends_data } = await axios.get(
    `${getApiUrl()}/api/friends/get-friends?user_id=${user_id}`
  )
  return {
    props: { profile_data, friends_data },
    revalidate: 300,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data: user_ids } = await axios.get(
    `${getApiUrl()}/api/users/get-user-ids`
  );
  const paths = user_ids.map((x: any) => {
    return { params: { user_id: x.user_id } };
  });
  return {
    paths,
    fallback: false,
  };
};

export default ProfilePage;
