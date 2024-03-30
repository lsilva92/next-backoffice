import { SortDescriptor } from "@nextui-org/react";
import { SVGProps} from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface TableProps {
  isLoading: Boolean,
  rows: Item[],
  renderCell: (item: Item, columnKey: React.Key) => JSX.Element,
  addNewItem: () => void,
  topContent: JSX.Element,
  bottomContent: JSX.Element,
  headerColumns: Column[],
  sortDescriptor: SortDescriptor,
  setSortDescriptor: any,
  sortedItems: Item[],
  setSelectedKeys: any,
  selectedKeys: any,
};

export interface ModalProps {
  backdrop:  any ,
  isOpen: boolean,
  onClose: () => void,
  modelTitle: string,
  handleConfirm: () => void,
  disableConfirm: boolean
}

export interface Item {
  _id: string, 
  ticket: string,
  bd: string, 
  created: Date,
  description: string,
  sync: boolean
}

export interface Column {
  key: string,
  label: string,
  sortable: boolean
}