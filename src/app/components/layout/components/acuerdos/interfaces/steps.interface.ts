export interface PeriodProcessStepsI {
    acuerdosStepsStatus: ProcessStepsI[]
    id: number
    tipoProceso: {id: number, nombre: string}
  }

  export interface ProcessStepsI {
    fechaCompletado?: Date
    id: number
    procesoSecuencia: OrderStepsI
  }
  
  export interface OrderStepsI {
    id: number
    orden: number
    paso: StepsI
  }
  
  export interface StepsI {
    id: number
    nombre: string
    responsable: string
  }