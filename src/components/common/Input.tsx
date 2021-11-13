import { textProps } from "components/Login/types";
import styled from "styled-components";
import { useState, useRef } from "react";

export default function Input({ innerText }: textProps) {
    const textType = innerText === "비밀번호" ? "password" : "text";
    let [value, setVaule] = useState("");

    const TextRef = useRef<HTMLSpanElement>(null);
    const InputRef = useRef<HTMLInputElement>(null);

    // input에 값이 있을 때, 설명 작게 조절
    const handleText = (event: React.ChangeEvent<HTMLInputElement>) => {
        const check = event.target.value.length;
        const explanText = TextRef.current;
        if (check) {
            explanText?.classList.add("small");
            InputRef.current?.classList.add("inputSmall");
        } else {
            explanText?.classList.remove("small");
            InputRef.current?.classList.remove("inputSmall");
        }
        setVaule(event.target.value);
    };

    return (
        <Wrapper>
            <InputContent>
                <Label>
                    <Span ref={TextRef}>{innerText}</Span>
                    <WritingForm
                        onChange={handleText}
                        type={textType}
                        ref={InputRef}
                        value={value}
                    />
                </Label>
                <State></State>
            </InputContent>
        </Wrapper>
    );
}

// style
const Wrapper = styled.div`
    margin: 0 40px 6px;
`;

const InputContent = styled.div`
    display: flex;
    font-size: 14px;
    position: relative;
    width: 100%;
    border: 1px solid ${(props) => props.theme.color.bd_gray};
    background-color: ${(props) => props.theme.color.bg_gray};
    border-radius: 3px;
`;

const Label = styled.label`
    height: 36px;
    flex: 1 0 0;
    padding: 0;
    margin: 0;
    min-width: 0;
    position: relative;
    cursor: text;

    // input에 값이 쓰이면 이벤트
    .small {
        transform: scale(0.83333) translateY(-10px);
    }
    .inputSmall {
        padding: 14px 0 2px 8px;
    }
`;

const Span = styled.span`
    color: #8e8e8e;
    font-size: 12px;
    height: 36px;
    left: 8px;
    line-height: 36px;
    position: absolute;
    right: 0;
    transform-origin: left;
    transition: transform ease-out 0.1s;
`;

const WritingForm = styled.input`
    border: 0;
    flex: 1 0 auto;
    margin: 0;
    outline: 0;
    padding: 9px 0 7px 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    height: 100%;
    font-size: 12px;
`;

const State = styled.div`
    height: 100%;
    padding-right: 8px;
`;
