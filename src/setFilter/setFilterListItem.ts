import {
    Component,
    ICellRendererFunc,
    CellRendererService,
    Autowired,
    PostConstruct,
    GridOptionsWrapper,
    ICellRendererComp
} from "ag-grid/main";

export class SetFilterListItem extends Component {

    public static EVENT_SELECTED = 'selected';

    @Autowired('gridOptionsWrapper') private gridOptionsWrapper: GridOptionsWrapper;
    @Autowired('cellRendererService') private cellRendererService: CellRendererService;

    private static TEMPLATE =
        '<label class="ag-set-filter-item">'+
        '<input type="checkbox" class="ag-filter-checkbox"/>'+
        '<span class="ag-filter-value"></span>'+
        '</label>';

    private eCheckbox: HTMLInputElement;

    private value: any;
    private cellRenderer: {new(): ICellRendererComp} | ICellRendererFunc | string;

    constructor(value: any, cellRenderer: {new(): ICellRendererComp} | ICellRendererFunc | string) {
        super(SetFilterListItem.TEMPLATE);
        this.value = value;
        this.cellRenderer = cellRenderer;
    }

    @PostConstruct
    private init(): void {
        this.render();

        this.eCheckbox = this.queryForHtmlInputElement("input");

        this.addDestroyableEventListener(this.eCheckbox, 'click', ()=> this.dispatchEvent(SetFilterListItem.EVENT_SELECTED) );
    }

    public isSelected(): boolean {
        return this.eCheckbox.checked;
    }

    public setSelected(selected: boolean): void {
        this.eCheckbox.checked = selected;
    }

    public render(): void {

        let valueElement = this.queryForHtmlElement(".ag-filter-value");

        // let valueElement = eFilterValue.querySelector(".ag-filter-value");
        if (this.cellRenderer) {
            let component = this.cellRendererService.useCellRenderer(this.cellRenderer, valueElement, {value: this.value});
            if (component && component.destroy) {
                this.addDestroyFunc( component.destroy.bind(component) );
            }
        } else {
            // otherwise display as a string
            let localeTextFunc = this.gridOptionsWrapper.getLocaleTextFunc();
            let blanksText = '(' + localeTextFunc('blanks', 'Blanks') + ')';
            let displayNameOfValue = this.value === null ? blanksText : this.value;
            valueElement.innerHTML = displayNameOfValue;
        }

    }

}
