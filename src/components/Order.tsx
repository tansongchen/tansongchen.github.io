import { FaCheck, FaClock, FaEnvelope, FaExclamationTriangle, FaUser, FaUtensils } from 'react-icons/fa';
import React, { Component, Fragment } from 'react';
import { mmdd } from '../utils/metadata';
import { put } from '../utils/client';
import Dropdown from './Dropdown';

enum MealType {
  breakfast,
  lunch,
  dinner
}

enum OrderType {
  select,
  random
}

interface FormState {
  name: string,
  email: string,
  date: Date,
  mealtype: MealType,
  ordertype: OrderType,
  content: string
}

interface FormProps {
  submit: (s: FormState) => void,
  submitting: boolean,
  selected: Map<string, number>,
  update: (s: string, n: number) => void,
  shouldSelect: boolean,
  changeSelect: (b: boolean) => void,
}

class Form extends Component<FormProps, FormState> {
  state: FormState = {
    name: "",
    email: "",
    content: "",
    date: new Date((new Date()).getTime() + 86400 * 1000),
    ordertype: OrderType.select,
    mealtype: MealType.dinner
  }
  render() {
    const isEmailValid = this.state.email === "" ? 0 : (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email) ? 1 : -1);
    const classSuffix = isEmailValid === 0 ? "" : (isEmailValid === 1 ? " is-success" : " is-danger");
    const buttonSuffix = isEmailValid === -1 ? " is-disabled" : (this.props.submitting ? " is-loading" : "");
    const orderOptions = [OrderType.select, OrderType.random];
    const displayOrderType = (o: OrderType) => o === OrderType.select ? "提前选择菜品" : "请我即兴发挥";
    const changeOrderType = (o: OrderType) => this.setState({ordertype: o});
    const now = new Date();
    const dateOptions = [1, 2, 3, 4, 5, 6, 7].map(d => new Date(now.getTime() + d * 86400 * 1000));
    const displayDate = mmdd;
    const changeDate = (d: Date) => this.setState({date: d});
    const mealOptions = (this.state.date.getDay() === 0 || this.state.date.getDay() === 6) ? [MealType.breakfast, MealType.lunch, MealType.dinner] : [MealType.dinner];
    const displayMealType = (s: MealType) => s === MealType.breakfast ? "早餐" : s === MealType.lunch ? "午餐" : "晚餐";
    const changeMealType = (s: MealType) => this.setState({mealtype: s});
    const newShouldSelect = (o: OrderType) => o === OrderType.select ? true : false;
    let summary: string[] = [];
    for (let [key, value] of this.props.selected) {
      if (value === 1) {
        summary.push(key);
      }
    }
    return (
      <article style={{margin: "2rem 0"}}>
        <p className="title is-4">您的订单</p>
        <div className="level">
          <div className="level-left">
            <div style={{padding: ".5rem .5rem .5rem 0", display: "inline-flex"}}>您希望</div>
            <Dropdown<OrderType> options={orderOptions} callback={x => {changeOrderType(x); this.props.changeSelect(newShouldSelect(x))}} current={this.state.ordertype} display={displayOrderType}/>
          </div>
          <div className="level-right">
            <div style={{padding: ".5rem .5rem .5rem 0", display: "inline-flex"}}>在</div>
            <Dropdown<Date> options={dateOptions} callback={changeDate} current={this.state.date} display={displayDate}/>
            <div style={{padding: ".5rem", display: "inline-flex"}}>的</div>
            <Dropdown<MealType> options={mealOptions} callback={changeMealType} current={this.state.mealtype} display={displayMealType}/>
            <div style={{padding: ".5rem", display: "inline-flex"}}>品尝</div>
          </div>
        </div>
        {
          this.props.shouldSelect ? <ul className="block">
            {summary.map(x => <SummaryItem key={x} name={x} update={this.props.update}/>)}
          </ul> :
          <div></div>
        }
        <div className="columns" style={{marginBottom: 0}}>
          <div className="column field">
            <div className="control has-icons-left has-icons-right">
              <input className="input" type="text" placeholder="您的姓名" value={this.state.name} onChange={e => this.setState({name: e.target.value})} />
              <span className="icon is-small is-left">
                <FaUser />
              </span>
            </div>
          </div>

          <div className="column field">
            <div className="control has-icons-left has-icons-right">
              <input className={"input" + classSuffix} type="email" placeholder="您的邮箱" value={this.state.email} onChange={e => this.setState({email: e.target.value})} />
              <span className="icon is-small is-left">
                <FaEnvelope />
              </span>
              <span className="icon is-small is-right">
                {isEmailValid === 1 ? <FaCheck /> : (isEmailValid === 0 ? <FaClock /> : <FaExclamationTriangle />)}
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


interface OrderProps {
  selected: Map<string, number>,
  shouldSelect: boolean,
  update: (a: string, b: number) => void,
  changeSelect: (b: boolean) => void
}

interface OrderState {
  error: boolean,
  submitting: boolean
}

const SummaryItem = ({ name, update }: { name: string, update: (a: string, b: number) => void }) => <div className="block" style={{display: "flex"}}>
  <div className="button" style={{width: "70%"}}>
    {name}
  </div>
  <button className="button is-danger" style={{marginLeft: "auto"}} onClick={() => update(name, 0)}>
    取消
  </button>
</div>

class Order extends Component<OrderProps, OrderState> {
  state: OrderState = {
    error: false,
    submitting: false,
  }

  onSubmitOrder = async (form: FormState) => {
    this.setState({ submitting: true });
    const summary: string[] = [...this.props.selected.entries()].filter(([key, value]) => value === 1).map(([key, _]) => key);
    const order = {...form, id: Date.now().toString(), summary: summary};
    put('/order', order);
    this.setState({ submitting: false });
  }

  render() {
    const { submitting, error } = this.state;
    return (
      <section className="section">
        <div className="container is-max-desktop">
          <Form submit={this.onSubmitOrder} submitting={submitting} selected={this.props.selected} update={this.props.update} shouldSelect={this.props.shouldSelect} changeSelect={this.props.changeSelect}/>
        </div>
      </section>
    )
  }
}

export default Order;
