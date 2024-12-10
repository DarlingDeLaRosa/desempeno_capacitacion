export interface ResponseI{
  message: string,
  statusCode: number,
  status: boolean,
  data: [],
  currentPage:number,
  totalItem:number,
  totalPage:number
}

export interface PaginationI{
  currentPage:number,
  totalItem:number,
  totalPage:number
}

export interface PeriodoI{
  idPeriodo: number,
  nombre: string,
  estado: boolean,
  fechaInicio: string,
  fechaFin: string
}
