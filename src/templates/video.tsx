import '../styles/index.scss';
import React, { Component } from 'react';
import { graphql, PageProps } from 'gatsby';
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import Layout from '../components/Layout';
import slugify from '../utils/slugify';
import { Piece } from '../utils/types';
import ExifImage, { IExifImage, preprocessExif } from '../components/ExifImage';
import Commenter from '../components/Commenter';

const Video = ({ name }: {name: string}) => <Layout slug={`videos/${slugify(name)}`}>
  <h1>{name}</h1>
</Layout>

export default function({ data }: PageProps<Queries.VideoQuery>) {
  const { title } = data.notionPage!;
  return <Video name={title!}/>
}

export const query = graphql`
  query Video ($id: String) {
    notionPage(id: {eq: $id}) {
      title
    }
  }
`
