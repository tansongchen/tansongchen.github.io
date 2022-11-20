import React, { Fragment, Component } from 'react';
import { IGatsbyImageData, GatsbyImage } from 'gatsby-plugin-image';
import { FaCamera, FaCalendar, FaLocationArrow } from 'react-icons/fa';
import { RiCameraLensFill } from 'react-icons/ri';
import { MdTune } from 'react-icons/md';
import { createDate, yymmdd } from '../utils/metadata';
import { ExifData } from 'fast-exif';

export interface IExif {
  datetime: Date,
  camera: {
    make: string,
    model: string,
  }
  lens: {
    make: string | null,
    model: string,
  }
  focalLength: number,
  gps: {
    latitudeRef: string,
    latitude: [number, number, number],
    longitudeRef: string,
    longitude: [number, number, number]
  }
  exposure: {
    iso: number,
    aperture: number,
    time: number,
    bias: number
  }
}

const localize = (s: string) => {
  return s.replace('back dual wide camera', '广角相机');
}

export interface IExifImage {
  exif: IExif,
  image: IGatsbyImageData
};

type ExifImageProps = IExifImage & { alt: string };
export default class extends Component<ExifImageProps, { active: boolean }> {
  state = {
    active: false
  }

  render() {
    const { exif, image, alt } = this.props;
    const renderCoordinate = (d: number, m: number, s: number, ref: string) => `${d}°${m}′${Math.round(s)}″${ref}`;
    return <Fragment>
    <section className="section">
      <div className="container is-max-desktop content">
        <GatsbyImage image={image} alt={alt} aria-haspopup="true" onClick={() => this.setState({active: true})}/>
      </div>
      <div className={"modal" + (this.state.active ? " is-active" : "")} key={alt}>
        <div className="modal-background"></div>
        <div className="modal-content content has-text-centered">
          <GatsbyImage image={image} alt={alt}/>
        </div>
        <button className="modal-close is-large" aria-label="close" onClick={() => this.setState({active: false})} />
      </div>
    </section>
    <section className='section'>
      <div className="container is-max-desktop content">
        <div className='columns'>
          <div className="column">
            <p><FaCalendar />&nbsp; &nbsp; {yymmdd(exif.datetime)}</p>
          </div>
          <div className="column">
            <p>
              <FaLocationArrow />&nbsp; &nbsp;
              {renderCoordinate(...exif.gps.latitude, exif.gps.latitudeRef)}
              &nbsp; &nbsp;
              {renderCoordinate(...exif.gps.longitude, exif.gps.longitudeRef)}
            </p>
          </div>
        </div>
        <div className='columns'>
          <div className="column">
            <p><FaCamera />&nbsp; &nbsp; {exif.camera.make} {exif.camera.model}</p>
          </div>
          <div className="column">
            <p><RiCameraLensFill />&nbsp; &nbsp; {localize(exif.lens.model)}</p>
          </div>
          <div className='column'>
            <p>
              <MdTune />&nbsp; &nbsp;
              {exif.focalLength}mm&nbsp; &nbsp;
              ƒ/{exif.exposure.aperture}&nbsp; &nbsp;
              {
                exif.exposure.time >= 1 ?
                `${exif.exposure.time}` :
                `1/${Math.round(1 / exif.exposure.time)}`
              }s&nbsp; &nbsp;
              ISO {exif.exposure.iso}
            </p>
          </div>
        </div>
      </div>
    </section>
  </Fragment>
  }
}

type Nullable<T> = {
  readonly [K in keyof T]: Nullable<T[K]> | null;
};

export function preprocessExif(exif: Nullable<ExifData>): IExif {
  const { exif: ex, image, gps } = exif!;
  return {
    datetime: createDate(ex!.DateTimeOriginal!),
    camera: {
      make: image!.Make!,
      model: image!.Model!,
    },
    lens: {
      make: ex!.LensMake!,
      model: ex!.LensModel!,
    },
    focalLength: ex!.FocalLength!,
    exposure: {
      iso: ex!.ISO!,
      aperture: ex!.FNumber!,
      time: ex!.ExposureTime!,
      bias: ex!.ExposureBiasValue!,
    },
    gps: {
      latitudeRef: gps!.GPSLatitudeRef!,
      latitude: gps!.GPSLatitude as [number, number, number],
      longitudeRef: gps!.GPSLongitudeRef!,
      longitude: gps!.GPSLongitude as [number, number, number],
    }
  }
}
