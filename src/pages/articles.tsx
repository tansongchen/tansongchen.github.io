import "../styles/index.scss"
import React, { Fragment } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"

const EducationItem = () => <section>

</section>

const Education = () => <article>
  Introduction of Songchen Tan
</article>

const ExperienceItem = () => <section>

</section>

const Experience = () => <article>

</article>

const ProjectItem = () => <section>

</section>

const Project = () => <section>

</section>

const About = () => {
  return (
    <Fragment>
      <Header current="index"/>
      <main>
        <title>主页</title>
        <Education />
        <Experience />
        <Project />
      </main>
      <Footer current="index"/>
    </Fragment>
  )
}

export default About
