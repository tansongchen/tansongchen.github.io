declare module 'fast-exif' {
  type ExifData = {
    exif: {
      DateTimeOriginal: string,
      LensMake: string,
      LensModel: string,
      FocalLength: number,
      ISO: number,
      FNumber: number,
      ExposureTime: number,
      ExposureBiasValue: number,
    },
    gps: {
      GPSLatitudeRef: string,
      GPSLatitude: number[],
      GPSLongitudeRef: string,
      GPSLongitude: number[],
    },
    image: {
      Make: string,
      Model: string
    }
  }
  function read(filename: string): Promise<ExifData>;
}
