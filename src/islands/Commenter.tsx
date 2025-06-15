import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaExclamationTriangle,
  FaCheck,
} from "react-icons/fa";
import { yymmdd, put, get, type Comment } from "..";
import useSWRImmutable from "swr/immutable";
import {
  useForm,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import clsx from "clsx";

type CommentFormInput = Omit<
  Comment,
  "id" | "datetime" | "collection" | "entry"
>;

interface CommentFormProps {
  submit: (s: CommentFormInput) => void;
  submitting: boolean;
}

export function BaseForm(
  register: UseFormRegister<CommentFormInput>,
  errors: FieldErrors<CommentFormInput>,
  submitting: boolean
) {
  return (
    <>
      <div className="columns">
        <div className="column field">
          <div className="control has-icons-left">
            <input
              className="input"
              type="text"
              placeholder="您的昵称（可选）"
              {...register("name")}
            />
            <span className="icon is-small is-left">
              <FaUser />
            </span>
          </div>
        </div>
        <div className="column field">
          <div className="control has-icons-left has-icons-right">
            <input
              className={clsx("input", errors.email && "is-danger")}
              type="email"
              placeholder="您的邮箱（可选）"
              {...register("email", {
                pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
              })}
            />
            <span className="icon is-small is-left">
              <FaEnvelope />
            </span>
            <span className="icon is-small is-right">
              {errors.email ? <FaExclamationTriangle /> : <FaCheck />}
            </span>
          </div>
          <p className={"help"}>
            {errors.email
              ? "这不是一个正确的邮箱地址"
              : "邮箱仅用于回复，不会公开展示"}
          </p>
        </div>
      </div>
      <div className="field">
        <div className="control">
          <textarea
            className="textarea"
            placeholder="评论内容"
            {...register("content")}
          ></textarea>
        </div>
      </div>
      <div className="field is-grouped is-justify-content-center">
        <div className="control">
          <button
            type="submit"
            className={clsx("button", "is-link", submitting && "is-loading")}
          >
            提交
          </button>
        </div>
      </div>
    </>
  );
}

function CommentForm({ submit, submitting }: CommentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CommentFormInput>();
  return (
    <form onSubmit={handleSubmit(submit)}>
      {BaseForm(register, errors, submitting)}
    </form>
  );
}

const CommentEntry = ({ name, datetime, content }: Comment) => {
  return (
    <div className="card">
      <div className="card-content">
        <div className="media">
          <div className="media-content">
            <p className="title is-4">{name}</p>
            <p className="subtitle is-6">{yymmdd(new Date(datetime))}</p>
          </div>
        </div>
        <div className="content">{content}</div>
      </div>
    </div>
  );
};

export default function Commenter({
  collection,
  entry,
}: Record<string, string>) {
  const [submitting, setSubmitting] = useState(false);
  const { data, error, mutate } = useSWRImmutable(`/comment`, get<Comment[]>);
  const onSubmitComment = async (form: CommentFormInput) => {
    const datetime = new Date();
    const comment: Comment = {
      ...form,
      id: datetime.getTime(),
      datetime: datetime.toISOString(),
      entry,
      collection,
    };
    const optimisticData = [...(data ?? []), comment];
    const updateFn = async () => {
      setSubmitting(true);
      await put("/comment", comment);
      setSubmitting(false);
      return optimisticData;
    };
    mutate(updateFn, {
      optimisticData,
      populateCache: true,
      revalidate: false,
    });
  };
  const current = data?.filter(
    (x) => x.collection === collection && x.entry === entry
  );

  return (
    <section className="section">
      <div className="container is-max-desktop">
        <h1 className="title">站内评论</h1>
        <CommentForm submit={onSubmitComment} submitting={submitting} />
        <hr />
        {current === undefined || error ? (
          <p>站内评论加载中……</p>
        ) : current.length === 0 ? (
          <p>暂无站内评论</p>
        ) : (
          current.map(CommentEntry)
        )}
      </div>
    </section>
  );
}
