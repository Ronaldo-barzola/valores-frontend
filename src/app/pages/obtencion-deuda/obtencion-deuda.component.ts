import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@app/services/api.service';
import { NzButtonSize } from 'ng-zorro-antd/button';

interface ItemData {
  id: number;
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'app-obtencion-deuda',
  templateUrl: './obtencion-deuda.component.html',
  styleUrls: ['./obtencion-deuda.component.scss'],
})
export class ObtencionDeudaComponent implements OnInit {
  listOfSelection = [
    {
      text: 'Select All Row',
      onSelect: () => {
        this.onAllChecked(true);
      },
    },
    {
      text: 'Select Odd Row',
      onSelect: () => {
        this.listOfCurrentPageData.forEach((data, index) =>
          this.updateCheckedSet(data.id, index % 2 !== 0)
        );
        this.refreshCheckedStatus();
      },
    },
    {
      text: 'Select Even Row',
      onSelect: () => {
        this.listOfCurrentPageData.forEach((data, index) =>
          this.updateCheckedSet(data.id, index % 2 === 0)
        );
        this.refreshCheckedStatus();
      },
    },
  ];

  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly ItemData[] = [];
  listOfData: readonly ItemData[] = [];
  setOfCheckedId = new Set<number>();

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach((item) =>
      this.updateCheckedSet(item.id, value)
    );
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event: readonly ItemData[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every((item) =>
      this.setOfCheckedId.has(item.id)
    );
    this.indeterminate =
      this.listOfCurrentPageData.some((item) =>
        this.setOfCheckedId.has(item.id)
      ) && !this.checked;
  }

  validateForm!: FormGroup;
  size: NzButtonSize = 'small';
  date = null;

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
  }

  paramNumProceso: any;
  dataListado: any = [];

  filterTipoContrib: string = '';
  filterTipoValor: string = '';
  filterAnioDesde: string = '';
  filterAnioHasta: string = '';
  filterMontoDesde: string = '';
  filterMontoHasta: string = '';

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      tipoContri: [null, [Validators.required]],
      tipoValor: [null, [Validators.required]],
      anioDesde: [null, [Validators.required]],
      anioHasta: [null, [Validators.required]],
      montoDesde: [null, [Validators.required]],
      montoHasta: [null, [Validators.required]],
    });
  }

  filtraInformacion() {
    // let btnSend = document.getElementById('btnSendAyuda') as HTMLButtonElement;

    // btnSend.disabled = true;
    // btnSend.innerHTML = '<i class="fa fa-spinner fa-pulse fa-fw"></i> Enviando...';

    const formData = new FormData();
    formData.append('p_anoini', this.filterAnioDesde);
    formData.append('p_anofin', this.filterAnioHasta);
    formData.append('p_tipcon', this.filterTipoContrib);
    formData.append('p_tipval', this.filterTipoValor);
    formData.append('p_monini', this.filterMontoDesde);
    formData.append('p_monfin', this.filterMontoHasta);

    this.api.postDataProceso(formData).subscribe((data: any) => {});

    this.router.navigate(['/proceso']);
  }

  regresarProcesos() {
    this.router.navigate(['/listado-contrib', this.paramNumProceso]);
  }
}
