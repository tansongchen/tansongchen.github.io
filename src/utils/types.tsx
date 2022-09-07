export interface Piece {
  name: string,
  date: Date,
  category: string,
  tags: string[],
  description: string,
  suite?: string
}

export interface Suite<T extends Piece> {
  name: string,
}

export interface Art {
  categories: string[],

}
