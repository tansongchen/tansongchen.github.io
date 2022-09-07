import { faCheck, faClock, faEnvelope, faExclamationTriangle, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import { yymmdd } from '../utils/metadata';
import hash from 'object-hash';

const endpoint = 'https://mac5hbk0qb.execute-api.us-east-1.amazonaws.com/';

interface FormState {
  name: string,
  email: string,
  content: string
}

interface FormProps {
  submit: (s: FormState) => void,
  submitting: boolean
}

class Form extends Component<FormProps, FormState> {
  state: FormState = {
    name: "",
    email: "",
    content: ""
  }
  render() {
    const isEmailValid = this.state.email === "" ? 0 : (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email) ? 1 : -1);
    const classSuffix = isEmailValid === 0 ? "" : (isEmailValid === 1 ? " is-success" : " is-danger");
    const buttonSuffix = isEmailValid === -1 ? " is-disabled" : (this.props.submitting ? " is-loading" : "");
    return (
      <article style={{margin: "2rem"}}>
        <div className="columns" style={{marginBottom: 0}}>
          <div className="column field">
            <div className="control has-icons-left has-icons-right">
              <input className="input" type="text" placeholder="您的昵称（可选）" value={this.state.name} onChange={e => this.setState({name: e.target.value})} />
              <span className="icon is-small is-left">
                <FontAwesomeIcon icon={faUser} />
              </span>
            </div>
          </div>

          <div className="column field">
            <div className="control has-icons-left has-icons-right">
              <input className={"input" + classSuffix} type="email" placeholder="您的邮箱（可选）" value={this.state.email} onChange={e => this.setState({email: e.target.value})} />
              <span className="icon is-small is-left">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
              <span className="icon is-small is-right">
                <FontAwesomeIcon icon={isEmailValid === 1 ? faCheck : (isEmailValid === 0 ? faClock : faExclamationTriangle)} />
              </span>
            </div>
            <p className={"help" + classSuffix}>{(isEmailValid >= 0) ? "邮箱仅用于回复提醒，不会公开展示" : "这不是一个正确的邮箱地址"}</p>
          </div>
        </div>

        <div className="columns field" style={{marginTop: 0}}>
          <div className="column">
            <div className="control">
              <textarea className="textarea" placeholder="评论内容" value={this.state.content} onChange={e => this.setState({content: e.target.value})} ></textarea>
            </div>
          </div>
        </div>

        <div className="column field is-grouped" style={{justifyContent: "center"}}>
          <div className="control">
            <button className={"button is-link" + buttonSuffix} onClick={() => this.props.submit(this.state)}>提交</button>
          </div>
        </div>
      </article>
    )
  }
}

interface CommentProps extends FormState {
  id: string,
  art: string,
  slug: string,
  datetime: Date
}

const Comment = ({ id, name, datetime, content }: CommentProps) => {
  return (
    <div className="content" key={id}>
      <p><span style={{fontSize: "150%", marginRight: "1rem"}}>@{name || '无名氏'}</span>{yymmdd(datetime)}</p>
      <p>{content}</p>
    </div>
  )
}

interface CommenterProps {
  slug: string,
}

interface CommenterState {
  comments: CommentProps[],
  error: boolean,
  submitting: boolean
}

class Commenter extends Component<CommenterProps, CommenterState> {
  state: CommenterState = {
    comments: [],
    error: false,
    submitting: false,
    // success: false,
    // error: false,
  }

  async componentDidMount() {
    try {
      const response = await fetch(endpoint + this.props.slug);
      const rawComments = (await response.json()).Items as CommentProps[];
      this.setState({ comments: rawComments.map(
        a => ({...a, datetime: new Date(a.datetime)})
      )});
    } catch (e) {
      this.setState({ error: true });
    }
  }

  async onSubmitComment(form: FormState) {
    this.setState({ submitting: true });
    const [art, slug] = this.props.slug.split('/');
    const comment: CommentProps = {...form, datetime: new Date(), slug: slug, art: art, id: hash([form, slug, art], {algorithm: 'md5'})}
    try {
      await fetch(endpoint, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify(comment),
      });
      this.setState({ comments: [...this.state.comments, comment]});
      window.alert('提交成功！')
    } catch (error) {
      this.setState({ error: true })
    }
    this.setState({ submitting: false });
  }

  render() {
    const { submitting, error, comments } = this.state;
    return (
      <section className="section">
        <div className="container is-max-desktop">
          <Form submit={this.onSubmitComment} submitting={submitting}/>
          <hr />
          {error ? <p>评论系统出现故障</p> : comments.map(Comment)}
        </div>
      </section>
    )
  }
}

export default Commenter
