import { useAppSelector } from "app/store/Hooks";
import CloseSVG from "assets/Svgs/CloseSVG";
import LikedPersonUnit from "components/Common/LikedPeopleModal/LikedPersonUnit";
import Loading from "components/Common/Loading";
import { authorizedCustomAxios } from "customAxios";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import theme from "styles/theme";
import ModalCard from "styles/UI/ModalCard";

export interface LikedPersonType {
    following: boolean;
    member: {
        hasStory: boolean;
        id: number;
        image: {
            imageUrl: string;
        };
        name: string;
        username: string;
    };
}

interface PostlikedPeopleDataType {
    data: {
        content: LikedPersonType[];
    };
}

const getLikedPeople = async (
    page: number,
    type: "post" | "comment",
    id: number,
) => {
    const config = {
        params: {
            page,
            size: 10,
        },
    };
    try {
        const {
            data: {
                data: { content: arr },
            },
        } = await authorizedCustomAxios.get<PostlikedPeopleDataType>(
            `/${type === "post" ? "posts" : "comments"}/${id}/likes`,
            config,
        );
        return arr;
    } catch (error) {
        console.log(error);
        return [];
    }
};

const LIkedPeopleModalHeader = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    height: 42px;
    border-bottom: 1px solid ${(props) => props.theme.color.bd_gray};
    & > h1 {
        width: 100%;
        text-align: center;
        font-size: 16px;
        font-weight: ${(props) => props.theme.font.bold};
    }
    & > button {
        position: absolute;
        right: 0;
        width: 50px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

const LikedPeopleModalMain = styled.div`
    height: calc(100% - 42px);
    overflow-y: auto;
    & > .wrapper {
    }
`;

interface LikedPeopleModalProps {
    onModalOn: () => void;
    onModalOff: () => void;
    // 어떤 것에 대한 좋아요 정보인지 객체 형태로 전달받습니다
    modalInfo: {
        type: "post" | "comment";
        id: number;
    };
    isLiked: boolean;
}

const LikedPeopleModal = ({
    onModalOn,
    onModalOff,
    modalInfo,
    isLiked,
}: LikedPeopleModalProps) => {
    const userInfo = useAppSelector((state) => state.auth.userInfo);
    const [isLoading, setIsLoading] = useState(true);
    const [likedPeople, setLikedPeople] = useState<LikedPersonType[]>([]);
    const [isModalWidthSmall, setIsModalWidthSmall] = useState(
        window.innerWidth <= 735,
    );
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        const resizeEventHandler = () =>
            setIsModalWidthSmall(window.innerWidth <= 735);

        const keydownEventHandler = (event: KeyboardEvent) => {
            event.key === "Escape" && onModalOff();
        };
        window.addEventListener("resize", resizeEventHandler);
        window.addEventListener("keydown", keydownEventHandler);

        getLikedPeople(1, modalInfo.type, modalInfo.id)
            .then((data) => {
                setLikedPeople(
                    isLiked && userInfo
                        ? [
                              {
                                  following: false,
                                  member: {
                                      username: userInfo.memberUsername,
                                      name: userInfo.memberName,
                                      hasStory: false,
                                      image: {
                                          imageUrl: userInfo.memberImageUrl,
                                      },
                                      id: -1,
                                  },
                              },
                              ...data,
                          ]
                        : data,
                );
            })
            .finally(() => setIsLoading(false));
        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("resize", resizeEventHandler);
            window.removeEventListener("keydown", keydownEventHandler);
        };
    }, [modalInfo.id, modalInfo.type, onModalOff, isLiked, userInfo]);

    const getExtraLikedPeople = useCallback(async () => {
        try {
            const data = await getLikedPeople(
                currentPage + 1,
                "post",
                modalInfo.id,
            );
            if (!data.length) return;
            setLikedPeople((prev) => [...prev, ...data]);
            setCurrentPage((prev) => prev + 1);
        } catch (error) {}
    }, [modalInfo.id, currentPage]);

    return (
        <ModalCard
            modalType="withBackDrop"
            onModalOn={onModalOn}
            onModalOff={onModalOff}
            width={isModalWidthSmall ? 260 : 400}
            height={400}
        >
            <LIkedPeopleModalHeader>
                <h1>좋아요</h1>
                <button>
                    <CloseSVG
                        size="18"
                        color={theme.font.default_black}
                        onClick={onModalOff}
                    />
                </button>
            </LIkedPeopleModalHeader>
            <LikedPeopleModalMain>
                <div
                    className="wrapper"
                    style={{ height: likedPeople.length * 60 + "px" }}
                >
                    {likedPeople.map((personObj, index) => (
                        <LikedPersonUnit
                            personObj={personObj}
                            isSmall={isModalWidthSmall}
                            key={personObj.member.id}
                            isFourthFromLast={index === likedPeople.length - 4}
                            onView={getExtraLikedPeople}
                        />
                    ))}
                </div>
            </LikedPeopleModalMain>
            {isLoading && <Loading size={32} />}
        </ModalCard>
    );
};

export default LikedPeopleModal;
