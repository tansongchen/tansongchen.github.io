import React, { Component, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaExclamationTriangle,
  FaClock,
  FaCheck,
} from "react-icons/fa";
import { endpoint, yymmdd } from "../utils/metadata";
import { get, put } from "../utils/client";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";

interface FormState {
  name: string;
  email: string;
  content: string;
}

interface FormProps {
  submit: (s: FormState) => void;
  submitting: boolean;
}

class Form extends Component<FormProps, FormState> {
  state: FormState = {
    name: "",
    email: "",
    content: "",
  };
  render() {
    const isEmailValid =
      this.state.email === ""
        ? 0
        : /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email)
        ? 1
        : -1;
    const classSuffix =
      isEmailValid === 0
        ? ""
        : isEmailValid === 1
        ? " is-success"
        : " is-danger";
    const buttonSuffix =
      isEmailValid === -1
        ? " is-disabled"
        : this.props.submitting
        ? " is-loading"
        : "";
    return (
      <article style={{ margin: "2rem" }}>
        <div className="columns" style={{ marginBottom: 0 }}>
          <div className="column field">
            <div className="control has-icons-left has-icons-right">
              <input
                className="input"
                type="text"
                placeholder="您的昵称（可选）"
                value={this.state.name}
                onChange={(e) => this.setState({ name: e.target.value })}
              />
              <span className="icon is-small is-left">
                <FaUser />
              </span>
            </div>
          </div>

          <div className="column field">
            <div className="control has-icons-left has-icons-right">
              <input
                className={"input" + classSuffix}
                type="email"
                placeholder="您的邮箱（可选）"
                value={this.state.email}
                onChange={(e) => this.setState({ email: e.target.value })}
              />
              <span className="icon is-small is-left">
                <FaEnvelope />
              </span>
              <span className="icon is-small is-right">
                {isEmailValid === 1 ? (
                  <FaCheck />
                ) : isEmailValid === 0 ? (
                  <FaClock />
                ) : (
                  <FaExclamationTriangle />
                )}
              </span>
            </div>
            <p className={"help" + classSuffix}>
              {isEmailValid >= 0
                ? "邮箱仅用于回复提醒，不会公开展示"
                : "这不是一个正确的邮箱地址"}
            </p>
          </div>
        </div>

        <div className="columns field" style={{ marginTop: 0 }}>
          <div className="column">
            <div className="control">
              <textarea
                className="textarea"
                placeholder="评论内容"
                value={this.state.content}
                onChange={(e) => this.setState({ content: e.target.value })}
              ></textarea>
            </div>
          </div>
        </div>

        <div
          className="column field is-grouped"
          style={{ justifyContent: "center" }}
        >
          <div className="control">
            <button
              className={"button is-link" + buttonSuffix}
              onClick={() => this.props.submit(this.state)}
            >
              提交
            </button>
          </div>
        </div>
      </article>
    );
  }
}

interface CommentProps extends FormState {
  id: string;
  art: string;
  slug: string;
  datetime: Date;
}

const Comment = ({ id, name, datetime, content }: CommentProps) => {
  return (
    <div className="content" key={id}>
      <p>
        <span style={{ fontSize: "150%", marginRight: "1rem" }}>
          @{name || "无名氏"}
        </span>
        {yymmdd(datetime)}
      </p>
      <p>{content}</p>
    </div>
  );
};

function Commenter({ art, slug }: Record<string, string>) {
  const [submitting, setSubmitting] = useState(false);
  const key = `/comment?art=${art}&slug=${slug}`;
  const {
    data: rawComments,
    error,
    mutate,
  } = useSWRImmutable(key, (key) => fetch(endpoint + key).then((res) => res.json()));

  if (!rawComments || error)
    return (
      <section className="section">
        <div className="container is-max-desktop">
          <p>评论系统出现故障</p>
        </div>
      </section>
    );
  const comments = rawComments.map((a: any) => ({
    ...a,
    datetime: new Date(a.datetime),
  })) as CommentProps[];
  const onSubmitComment = async (form: FormState) => {
    const datetime = new Date();
    const comment: CommentProps = {
      ...form,
      id: datetime.getTime().toString(),
      datetime,
      slug: slug,
      art: art,
    };
    const optimisticData = [...comments, comment];
    const updateFn = async () => {
      await put("/comment", comment);
      return optimisticData;
    };
    mutate(updateFn, { optimisticData, populateCache: true, revalidate: false });
  };

  return (
    <section className="section">
      <div className="container is-max-desktop">
        <Form submit={onSubmitComment} submitting={submitting} />
        <hr />
        {comments.map(Comment)}
      </div>
    </section>
  );
}

export default Commenter;
