import { Component, Inject, OnInit } from '@angular/core';
import { ClassImports } from '../../../../../../helpers/class.components';
import { MaterialComponents } from '../../../../../../helpers/material.components';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { historicalChangesI } from '../../interfaces/acuerdo.interface';
import { ChangeItem, HistorialUI } from '../../interfaces/historic.interface';

@Component({
  selector: 'app-historico',
  standalone: true,
  imports: [MaterialComponents, ClassImports],
  templateUrl: './historico.component.html',
  styleUrl: './historico.component.css'
})
export class HistoricoComponent implements OnInit {

  historialUI: HistorialUI[] = [];

  constructor(
    public dialogRef: MatDialogRef<HistoricoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { changesList: historicalChangesI[], meta: string }
  ) { }

  ngOnInit() {
    this.historialUI = this.convertirHistorial(this.data.changesList);
  }

  convertirHistorial(historial: any[]): HistorialUI[] {

    return historial
      .map(item => {

        if (item.accion === 'CREATE') {
          return {
            fecha: item.fecha,
            accion: item.accion,
            mensaje: 'Se creó la meta.',
            cambios: []
          };
        }

        const anterior = JSON.parse(item.valorAnteriorJson);
        const nuevo = JSON.parse(item.valorNuevoJson);

        const cambios: ChangeItem[] = [];

        this.compararObjetos(anterior, nuevo, '', cambios);

        return {
          fecha: item.fecha,
          accion: item.accion,
          cambios
        };

      })
      .filter(item => item.accion === 'CREATE' || item.cambios.length > 0);
  }

  compararObjetos(
    anterior: any,
    nuevo: any,
    ruta: string,
    cambios: ChangeItem[]
  ) {

    const keys = new Set([
      ...Object.keys(anterior || {}),
      ...Object.keys(nuevo || {})
    ]);

    keys.forEach(key => {

      const viejo = anterior?.[key];
      const actual = nuevo?.[key];

      const nombre = ruta
        ? `${ruta}.${key}`
        : key;

      // arrays
      if (Array.isArray(viejo) && Array.isArray(actual)) {

        if (key === 'DocumentosObj') {

          const docsViejos = viejo.map((x: any) => x.Nombre);
          const docsNuevos = actual.map((x: any) => x.Nombre);

          docsNuevos
            .filter((x: any) => !docsViejos.includes(x))
            .forEach((doc: any) => {

              cambios.push({
                campo: 'Documento agregado',
                anterior: '',
                nuevo: doc
              });

            });

          docsViejos
            .filter((x: any) => !docsNuevos.includes(x))
            .forEach((doc: any) => {

              cambios.push({
                campo: 'Documento eliminado',
                anterior: doc,
                nuevo: ''
              });

            });

          return;
        }

        return;
      }

      // objetos

      if (
        viejo &&
        actual &&
        typeof viejo === 'object' &&
        typeof actual === 'object'
      ) {
        this.compararObjetos(viejo, actual, nombre, cambios);
        return;
      }

      // valores

      if (viejo !== actual) {

        cambios.push({
          campo: this.obtenerNombreCampo(nombre),
          anterior: viejo,
          nuevo: actual
        });

      }

    });

  }

  obtenerNombreCampo(campo: string) {

    const nombres: any = {
      'MetaObj.Valor': 'Valor de la meta',
      'MetaObj.MetaPoa': 'Meta de POA',
      'MetaObj.DescripcionMedioVerificacion': 'Descripción del medio de verificación',
      'Calificacion': 'Calificación',
      'Observaciones': 'Observación',
      'DocumentosObj': 'Documentos',
      'MetaObj.Nombre': 'Meta',
      'MedioVerificacionObj.Nombre': 'Medio de verificación',
      'MetaObj.MedioVerificacionObj.IdMedio': 'Identificador de medio de verificación',
      'MetaObj.MedioVerificacionObj.Nombre': 'Nombre de Medio de verificación',
    };

    return nombres[campo] ?? campo;
  }

  cerrar(): void {
    this.dialogRef.close();
  }

}
