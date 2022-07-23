import { RateButtonsProps } from "lib/types";
import { useEffect, useState } from "react";
import styles from "styles/components/rate_buttons.module.scss";
import axios from "axios";
import { getApiUrl } from "lib/utils";

const RateButtons: React.FC<RateButtonsProps> = ({
  post_id,
  comment_id,
  rate_info,
  user_id,
}) => {
  const [ups, setUps] = useState<number>(
    rate_info.filter((rate) => rate.rate_kind === "up").length || 0
  );
  const [downs, setDowns] = useState<number>(
    rate_info.filter((rate) => rate.rate_kind === "down").length || 0
  );
  const [isUp, setUp] = useState<boolean>(
    !!rate_info.find(
      (rate) => rate.rate_kind === "up" && rate.user_rate_id === user_id
    )
  );
  const [isDown, setDown] = useState<boolean>(
    !!rate_info.find(
      (rate) => rate.rate_kind === "down" && rate.user_rate_id === user_id
    )
  );

  useEffect(() => {
    setUp(
      !!rate_info.find(
        (rate) => rate.rate_kind === "up" && rate.user_rate_id === user_id
      )
    );
    setDown(
      !!rate_info.find(
        (rate) => rate.rate_kind === "down" && rate.user_rate_id === user_id
      )
    );
  }, [user_id]);

  console.log({ isUp, ups });

  const ratee_type = post_id
    ? {
        type: "post",
        id: post_id,
      }
    : {
        type: "comment",
        id: comment_id,
      };

  const onUp = async () => {
    try {
      setUp(!isUp);
      setUps(isUp ? ups - 1 : ups + 1);
      if (isDown) {
        setDown(false);
        setDowns(downs - 1);
        await axios.post(`${getApiUrl()}/api/rates/${ratee_type.type}-rate`, {
          rate_kind: "down",
          user_rate_id: user_id,
          [`${ratee_type.type}_rate_id`]: ratee_type.id,
          remove_rate: true,
        });
      }
      await axios.post(`${getApiUrl()}/api/rates/${ratee_type.type}-rate`, {
        rate_kind: "up",
        user_rate_id: user_id,
        [`${ratee_type.type}_rate_id`]: ratee_type.id,
        remove_rate: isUp,
      });
    } catch (e: any) {
      console.log("Up Failed!", e);
    }
  };
  const onDown = async () => {
    try {
      setDown(!isDown);
      setDowns(isDown ? downs - 1 : downs + 1);
      if (isUp) {
        setUp(false);
        setUps(ups - 1);
        await axios.post(`${getApiUrl()}/api/rates/${ratee_type.type}-rate`, {
          rate_kind: "up",
          user_rate_id: user_id,
          [`${ratee_type.type}_rate_id`]: ratee_type.id,
          remove_rate: true,
        });
      }
      await axios.post(`${getApiUrl()}/api/rates/${ratee_type.type}-rate`, {
        rate_kind: "down",
        user_rate_id: user_id,
        [`${ratee_type.type}_rate_id`]: ratee_type.id,
        remove_rate: isDown,
      });
    } catch (e: any) {
      console.log("Down Failed!", e);
    }
  };

  const upPaths = [
    <>
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M14.6 8H21a2 2 0 0 1 2 2v2.104a2 2 0 0 1-.15.762l-3.095 7.515a1 1 0 0 1-.925.619H2a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1h3.482a1 1 0 0 0 .817-.423L11.752.85a.5.5 0 0 1 .632-.159l1.814.907a2.5 2.5 0 0 1 1.305 2.853L14.6 8zM7 10.588V19h11.16L21 12.104V10h-6.4a2 2 0 0 1-1.938-2.493l.903-3.548a.5.5 0 0 0-.261-.571l-.661-.33-4.71 6.672c-.25.354-.57.644-.933.858zM5 11H3v8h2v-8z" />
    </>,
    <>
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M2 9h3v12H2a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1zm5.293-1.293l6.4-6.4a.5.5 0 0 1 .654-.047l.853.64a1.5 1.5 0 0 1 .553 1.57L14.6 8H21a2 2 0 0 1 2 2v2.104a2 2 0 0 1-.15.762l-3.095 7.515a1 1 0 0 1-.925.619H8a1 1 0 0 1-1-1V8.414a1 1 0 0 1 .293-.707z" />
    </>,
  ];

  const downPaths = [
    <>
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M9.4 16H3a2 2 0 0 1-2-2v-2.104a2 2 0 0 1 .15-.762L4.246 3.62A1 1 0 0 1 5.17 3H22a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-3.482a1 1 0 0 0-.817.423l-5.453 7.726a.5.5 0 0 1-.632.159L9.802 22.4a2.5 2.5 0 0 1-1.305-2.853L9.4 16zm7.6-2.588V5H5.84L3 11.896V14h6.4a2 2 0 0 1 1.938 2.493l-.903 3.548a.5.5 0 0 0 .261.571l.661.33 4.71-6.672c.25-.354.57-.644.933-.858zM19 13h2V5h-2v8z" />
    </>,
    <>
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M22 15h-3V3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1zm-5.293 1.293l-6.4 6.4a.5.5 0 0 1-.654.047L8.8 22.1a1.5 1.5 0 0 1-.553-1.57L9.4 16H3a2 2 0 0 1-2-2v-2.104a2 2 0 0 1 .15-.762L4.246 3.62A1 1 0 0 1 5.17 3H16a1 1 0 0 1 1 1v11.586a1 1 0 0 1-.293.707z" />
    </>,
  ];

  const buttons = (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        onClick={() => onUp()}
      >
        {upPaths[isUp ? 1 : 0]}
      </svg>
      <p>{ups}</p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        onClick={() => onDown()}
      >
        {downPaths[isDown ? 1 : 0]}
      </svg>
      <p>{downs}</p>
    </>
  );

  return <div className={styles.rate_buttons}>{buttons}</div>;
};

export default RateButtons;
