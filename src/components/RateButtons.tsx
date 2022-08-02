import { useEffect, useState } from "react";
import styles from "src/styles/components/rate_buttons.module.scss";
import { signIn, useSession } from "next-auth/react";
import { trpc } from "src/utils/trpc";

interface RateButtonProps {
  postId?: string;
  commentId?: string;
  rateInfo: {
    rateKind: string;
    userRateId: string;
  }[];
  id: string;
}

const RateButtons: React.FC<RateButtonProps> = ({
  postId,
  commentId,
  rateInfo,
  id,
}) => {
  const { data: session } = useSession();
  const postRateMutation = trpc.useMutation(["rate.postRate"]);
  const commentRateMutation = trpc.useMutation(["rate.commentRate"]);
  const [ups, setUps] = useState<number>(
    rateInfo.filter((rate) => rate.rateKind === "up").length || 0
  );
  const [downs, setDowns] = useState<number>(
    rateInfo.filter((rate) => rate.rateKind === "down").length || 0
  );
  const [isUp, setUp] = useState<boolean>(
    !!rateInfo.find((rate) => rate.rateKind === "up" && rate.userRateId === id)
  );
  const [isDown, setDown] = useState<boolean>(
    !!rateInfo.find(
      (rate) => rate.rateKind === "down" && rate.userRateId === id
    )
  );

  useEffect(() => {
    setUp(
      !!rateInfo.find(
        (rate) => rate.rateKind === "up" && rate.userRateId === id
      )
    );
    setDown(
      !!rateInfo.find(
        (rate) => rate.rateKind === "down" && rate.userRateId === id
      )
    );
  }, [id]);

  const rateeType = postId
    ? {
        type: "post",
        id: postId,
      }
    : {
        type: "comment",
        id: commentId,
      };

  const onUp = async () => {
    try {
      setUp(!isUp);
      setUps(isUp ? ups - 1 : ups + 1);
      if (isDown) {
        setDown(false);
        setDowns(downs - 1);
        switch (rateeType.type) {
          case "post": {
            await postRateMutation.mutateAsync({
              rateKind: "down",
              userRateId: id,
              removeRate: true,
              postRateId: rateeType.id as string,
            });
            break;
          }
          case "comment": {
            await commentRateMutation.mutateAsync({
              rateKind: "down",
              userRateId: id,
              removeRate: true,
              commentRateId: rateeType.id as string,
            });
            break;
          }
        }
      }
      switch (rateeType.type) {
        case "post": {
          await postRateMutation.mutateAsync({
            rateKind: "up",
            userRateId: id,
            removeRate: isUp,
            postRateId: rateeType.id as string,
          });
          break;
        }
        case "comment": {
          await commentRateMutation.mutateAsync({
            rateKind: "up",
            userRateId: id,
            removeRate: isUp,
            commentRateId: rateeType.id as string,
          });
          break;
        }
      }
    } catch (e: any) {
      console.error("Up Failed!", e);
    }
  };
  const onDown = async () => {
    try {
      setDown(!isDown);
      setDowns(isDown ? downs - 1 : downs + 1);
      if (isUp) {
        setUp(false);
        setUps(ups - 1);
        switch (rateeType.type) {
          case "post": {
            await postRateMutation.mutateAsync({
              rateKind: "up",
              userRateId: id,
              removeRate: true,
              postRateId: rateeType.id as string,
            });
            break;
          }
          case "comment": {
            await commentRateMutation.mutateAsync({
              rateKind: "up",
              userRateId: id,
              removeRate: true,
              commentRateId: rateeType.id as string,
            });
            break;
          }
        }
      }
      switch (rateeType.type) {
        case "post": {
          await postRateMutation.mutateAsync({
            rateKind: "down",
            userRateId: id,
            removeRate: isDown,
            postRateId: rateeType.id as string,
          });
          break;
        }
        case "comment": {
          await commentRateMutation.mutateAsync({
            rateKind: "down",
            userRateId: id,
            removeRate: isDown,
            commentRateId: rateeType.id as string,
          });
          break;
        }
      }
    } catch (e: any) {
      console.error("Down Failed!", e);
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
        onClick={session ? () => onUp() : () => signIn()}
      >
        {upPaths[isUp ? 1 : 0]}
      </svg>
      <p>{ups}</p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        onClick={session ? () => onDown() : () => signIn()}
      >
        {downPaths[isDown ? 1 : 0]}
      </svg>
      <p>{downs}</p>
    </>
  );

  return <div className={styles.rate_buttons}>{buttons}</div>;
};

export default RateButtons;
