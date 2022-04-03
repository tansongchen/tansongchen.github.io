import { faCheck, faClock, faEnvelope, faExclamationTriangle, faUser, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component, Fragment } from 'react'
import { format } from '../utils/metadata';
import hash from 'object-hash'

const endpoint = 'https://n49dt2t564.execute-api.us-east-1.amazonaws.com/';

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
              <input className="input" type="text" placeholder="您的姓名" value={this.state.name} onChange={e => this.setState({name: e.target.value})} />
              <span className="icon is-small is-left">
                <FontAwesomeIcon icon={faUser} />
              </span>
            </div>
          </div>

          <div className="column field">
            <div className="control has-icons-left has-icons-right">
              <input className={"input" + classSuffix} type="email" placeholder="您的邮箱" value={this.state.email} onChange={e => this.setState({email: e.target.value})} />
              <span className="icon is-small is-left">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
              <span className="icon is-small is-right">
                <FontAwesomeIcon icon={isEmailValid === 1 ? faCheck : (isEmailValid === 0 ? faClock : faExclamationTriangle)} />
              </span>
            </div>
            <p className={"help" + classSuffix}>{(isEmailValid >= 0) ? "邮箱仅用于回复，不会公开展示" : "这不是一个正确的邮箱地址"}</p>
          </div>
        </div>

        <div className="columns field" style={{marginTop: 0}}>
          <div className="column">
            <div className="control">
              <textarea className="textarea" placeholder="备注" value={this.state.content} onChange={e => this.setState({content: e.target.value})} ></textarea>
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

interface CommentProps {
  id: string,
  name: string,
  email: string,
  summary: string[],
  content: string
}

interface OrderProps {
  selected: Map<string, number>,
  update: (a: string, b: number) => void
}

interface OrderState {
  error: boolean,
  submitting: boolean
}

const SummaryItem = ({ name, update }) => <div className="block" style={{display: "flex"}}>
  <div className="button" style={{width: "70%"}}>
    {name}
  </div>
  <button className="button is-danger" style={{marginLeft: "auto"}} onClick={() => update(name, 0)}>
    取消
  </button>
</div>

const Summary = ({ selected, update }) => {
  let summary: string[] = [];
  for (let [key, value] of selected) {
    if (value === 1) {
      summary.push(key);
    }
  }
  return <article style={{margin: "2rem"}}>
  <p className="title is-4">您选择的菜品</p>
  <ul>
    {summary.map(x => <SummaryItem key={x} name={x} update={update}/>)}
  </ul>
</article>
}

class Order extends Component<OrderProps, OrderState> {
  state: OrderState = {
    error: false,
    submitting: false,
  }

  onSubmitOrder = async (form: FormState) => {
    this.setState({ submitting: true });
    let summary: string[] = [];
    for (let [key, value] of this.props.selected) {
      if (value === 1) {
        summary.push(key);
      }
    }

    let comment: CommentProps = {...form, id: hash(form, {algorithm: 'md5'}), summary: summary};
    try {
      console.log(comment);
      const response = await fetch(endpoint, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify(comment),
      });
      window.alert('提交成功！');
    } catch (error) {
      window.alert('提交失败！');
    }
    this.setState({ submitting: false });
  }

  render() {
    const { submitting, error } = this.state;
    return (
      <section className="section">
        <div className="container is-max-desktop">
          <Summary selected={this.props.selected} update={this.props.update}/>
          <Form submit={this.onSubmitOrder} submitting={submitting}/>
        </div>
      </section>
    )
  }
}

export default Order
