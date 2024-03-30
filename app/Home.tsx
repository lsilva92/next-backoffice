
"use client"
import React, { useCallback, useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { Tooltip, ChipProps, Chip, useDisclosure, Input, Checkbox, Textarea, Button,  Pagination, Selection, DropdownTrigger,
	Dropdown,
	DropdownMenu,
	DropdownItem,
	SortDescriptor,} from "@nextui-org/react";
import { EditIcon } from "@/components/icons/EditIcon";
import { EyeIcon } from "@/components/icons/EyeIcon";
import { DeleteIcon } from "@/components/icons/DeleteIcon";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { ChevronDownIcon  } from "@/components/icons/ChevronDownIcon";
import { TableComponent } from "@/app/components/common/Table";
import { ModalComponent } from "@/app/components/common/ModalComponent";
import { Item, Column } from '@/types';

export default function HomeClientComponent({ data }: any) {

	const rows: Item[] = data.rows;
	const columns: Column[] = data.columns;

	type Row = typeof rows[0];

	const router = useRouter();
	const[isLoading, setIsLoading] = useState<Boolean>(false);
	const statusColorMap: Record<string, ChipProps["color"]>  = {
		true: "success",
		false: "warning",
	  };
	const INITIAL_VISIBLE_COLUMNS = ['ticket','description', 'bd','sync','created', 'actions'];
	const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
	const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
	const [filterValue, setFilterValue] = useState("");
	const [page, setPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [statusFilter, setStatusFilter] = useState<Selection>("all");
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: "created",
		direction: "descending",
	  });
	
	//Modal
	const {isOpen, onOpen, onClose} = useDisclosure();
	const [updateModal, setUpdateModal] = useState<boolean>(false)
  	//const [backdrop, setBackdrop] = useState<string | undefined | null>('blur');
  	const [modelTitle, setmodelTitle] = useState<string>('');
  	const [modalAction, setModalAction] = useState<string>('');
	const [api, setApi] = useState<string>('');
	const [method, setMethod] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [apiBody, setApiBody] = useState<{ticket: string, bd: string, sync: boolean, description: string}>({ticket: '', bd: '', sync: false, description: ''});
	const [disableConfirm, setDisableConfirm] = useState<boolean>(false);

	const pages = Math.ceil(data.rows.length / rowsPerPage);

	const hasSearchFilter = Boolean(filterValue);

	const statusOptions = [
		{name: "Synced", uid: "sync"},
		{name: "Not Synced", uid: "notSync"}
	];

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value, type, checked } = e.target;

		const newValue = type === 'checkbox' ? checked : value;
		setApiBody(values => ({ ...values, [name]: newValue }));
	 };

 
 	const handleConfirm = async () => {
        const res = await fetch(api, {
           method: method,
           headers: {
               "Content-Type": "application/json",
           },
           body: JSON.stringify(apiBody)
       });

       if(res.status === 200){ 
		 router.refresh();
		 onClose();
       }
    };

	
	//Table Actions

	const addNewItem = (): void => {

		setDisableConfirm(false)
		setModalAction('NEWITEM');
		setApi(`/api/configdata`);
		setMethod('POST');
		setmodelTitle('Add new Item');

		setUpdateModal((value) => !value);

		onOpen();
	};

  	const handleEdit = (item: Item):void => {

		setDisableConfirm(false)
		setModalAction('EDIT');
		setApi(`/api/configdata/${item._id}`);
		setMethod('POST');
		setmodelTitle('Edit Item');
		
		setUpdateModal((value) => !value);

		setApiBody({
			 ticket: item.ticket,
			 bd: item.bd,
			 sync: item.sync,
			 description: item.description
		});
 

		onOpen();
	};

	const handleDelete = (id: String): void => {

		setDisableConfirm(false);
		setModalAction('DELETE');
		setmodelTitle('Delete Item');
		setApi(`/api/configdata/${id}`);
		setMethod('DELETE');

		setUpdateModal((value) => !value);

		onOpen();
	};

	const handleDetails = (description: string): void => {

		setDisableConfirm(true)
		setDescription(description)
		setModalAction('DETAILS');
		setmodelTitle('Description');

		setUpdateModal((value) => !value);
		
		onOpen();
	};

	const onRowsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>): void => {
		setRowsPerPage(Number(e.target.value));
		setPage(1);
	  }, []);

	const onSearchChange = useCallback((value?: string): void => {
		if (value) {
		  setFilterValue(value);
		  setPage(1);
		} else {
		  setFilterValue("");
		}
	  }, []);


	 const filteredItems = React.useMemo((): Item[] => {
	let filteredData = [...rows];
	 	if (hasSearchFilter) {
	  filteredData = filteredData.filter((row) =>{
		   return row.ticket.toLowerCase().includes(filterValue.toLowerCase()) ||
		  		 row.description.toLocaleLowerCase().includes(filterValue.toLowerCase()) ||
				 row.bd.toLocaleLowerCase().includes(filterValue.toLowerCase()) 
	  });
	}
  	if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
	  filteredData = filteredData.filter((row) =>{
		  let status;
		  if (Array.from(statusFilter).includes('notSync')){
			status = false;
		  }else if(Array.from(statusFilter).includes('sync')){
			status = true;
		  }
		  return row.sync === status;
	  }
	  );
	}
		return filteredData;
	 }, [ rows, filterValue, statusFilter ]);
	 
	 const items = React.useMemo((): Item[] => {
	  const start = (page - 1) * rowsPerPage;
	  const end = start + rowsPerPage;
	  
	  return filteredItems.slice(start, end);
	}, [filteredItems, page, rowsPerPage ]);
	
	const sortedItems = React.useMemo((): Item[] => {
		 return [...items].sort((a: Row, b: Row) => {
		const first = a[sortDescriptor.column as keyof Row] as unknown as number;
		const second = b[sortDescriptor.column as keyof Row] as unknown as number;
		const cmp = first < second ? -1 : first > second ? 1 : 0;
			return sortDescriptor.direction === "descending" ? -cmp : cmp;
		}); 
	 }, [sortDescriptor, items]);

	const headerColumns = useMemo((): Column[] => {
		if (visibleColumns === "all") return columns;
		return columns.filter((column) => Array.from(visibleColumns).includes(column.key));
	 }, [visibleColumns]);

	const topContent = useMemo((): JSX.Element => {
		return (
			<div className="flex flex-col gap-4">
				<div className="flex justify-between gap-3 items-end">
					<Input
						isClearable
						className="w-full sm:max-w-[44%]"
						placeholder="Search..."
						startContent={<SearchIcon />}
						value={filterValue}
						variant="bordered"
						onClear={() => setFilterValue("")}
						onValueChange={onSearchChange}
					/>
					<div className="flex gap-3">
						<Dropdown>
							<DropdownTrigger className="hidden sm:flex">
								<Button
								endContent={<ChevronDownIcon className="text-small" />}
								size="lg"
								variant="flat"
								>
								Status
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								disallowEmptySelection
								aria-label="Table Columns"
								closeOnSelect={false}
								selectedKeys={statusFilter}
								selectionMode="multiple"
								onSelectionChange={setStatusFilter}
							>
								{statusOptions.map((status) => (
									<DropdownItem key={status.uid} className="capitalize">
										{status.name}
									</DropdownItem>
								))}
							</DropdownMenu>
						</Dropdown>
						<Dropdown>
						<DropdownTrigger className="hidden sm:flex">
							<Button
							endContent={<ChevronDownIcon className="text-small" />}
							size="lg"
							variant="flat"
							>
							Columns
							</Button>
						</DropdownTrigger>
						<DropdownMenu
							disallowEmptySelection
							aria-label="Table Columns"
							closeOnSelect={false}
							selectedKeys={visibleColumns}
							selectionMode="multiple"
							onSelectionChange={setVisibleColumns}
						>
							{data.columns.map((column: Column) => (
								<DropdownItem key={column.key} className="capitalize">
									{column.label}
								</DropdownItem>
							))}
						</DropdownMenu>
						</Dropdown>						
						<Button color="primary" size="lg" endContent={<PlusIcon />} onClick={addNewItem}>
							Add New
						</Button>
					</div>
				</div>
				<div className="flex justify-between items-center">
					<span className="text-default-400 text-medium">Total {rows.length} records</span>
					<label className="flex items-center text-default-400 text-medium">
						Rows per page:
						<select
						className="bg-transparent outline-none text-default-400 text-medium"
						onChange={onRowsPerPageChange}
						defaultValue={rowsPerPage}
						>
							<option value="5">5</option>
							<option value="10">10</option>
							<option value="15">15</option>
						</select>
					</label>
				</div>
			</div>
		)
	
	},[filterValue, onRowsPerPageChange, addNewItem, visibleColumns]);

	const bottomContent = React.useMemo((): JSX.Element => {
		return (
		  <div className="py-2 px-2 flex justify-between items-center">
			<Pagination
			  showControls
			  classNames={{
				cursor: "bg-foreground text-background",
			  }}
			  color="default"
			  isDisabled={hasSearchFilter}
			  page={page}
			  total={pages}
			  variant="light"
			  onChange={setPage}
			  size='md'
			/>
 			<span className="text-medium text-default-400">
			  {selectedKeys === "all"
				? "All items selected"
				: `${selectedKeys.size} of ${items.length} selected`}
			</span>
		  </div>
		);
	  }, [ selectedKeys, page, pages, hasSearchFilter]);

 
    const renderCell = useCallback((item: Item, columnKey: React.Key): JSX.Element => {
		const cellValue = item[columnKey as keyof Item];

		if(typeof cellValue === "boolean"){
			return (
				<Chip className="capitalize" color={statusColorMap[cellValue ? 'true' : 'false' ]} size="sm" variant="flat">
					{cellValue ? 'Synced' : 'Not Synced'}
				</Chip>
				
			)
		}else if(typeof cellValue === "object"){
			return (
				<div className="flex flex-col">
				<p className="text-bold text-medium capitalize">{cellValue.toLocaleDateString()}</p>
			</div>
			)
		};


 		switch(columnKey){
			case'actions':
				return(
					<div className="relative flex items-center gap-2">
						<Tooltip content="Details">
						<span className="text-lg text-default-400 cursor-pointer active:opacity-50">
							<EyeIcon onClick={() => handleDetails(item.description)} />
						</span>
						</Tooltip>
						<Tooltip content="Edit Item">
						<span className="text-lg text-default-400 cursor-pointer active:opacity-50">
							<EditIcon onClick={() =>  handleEdit(item)}/>
						</span>
						</Tooltip>
						<Tooltip color="danger" content="Delete Item">
						<span className="text-lg text-danger cursor-pointer active:opacity-50">
							<DeleteIcon onClick={() => handleDelete(item._id)   }/>
						</span>
						</Tooltip>
					</div>
				);
			default:
				return(
					<div className="flex flex-col max-w-xl h-5">
						<p className="text-bold text-medium capitalize text-ellipsis overflow-hidden whitespace-nowrap">{cellValue}</p>
					</div>
				)
		}
	},[ apiBody ]);


	const RenderModalBody = useCallback((): JSX.Element => {

		switch(modalAction){
			case 'NEWITEM':
				return(
					<form className="flex flex-col gap-4">
						<Input type="text" name= "ticket" label="Ticket" onChange={handleChange} />
						<Input type="text" name= "bd" label="BD" onChange={handleChange}/>
						<Checkbox name= "sync"  onChange={handleChange}>
							Sincronizado
						</Checkbox>
						<Textarea label="Description" name="description" placeholder="Enter your description"  onChange={handleChange} />
					</form>
				)
			case 'EDIT':
				return(
					<form className="flex flex-col gap-4">
						<Input type="text" name= "ticket" label="Ticket" defaultValue={apiBody.ticket} onChange={handleChange} />
						<Input type="text" name= "bd" label="BD" defaultValue={apiBody.bd} onChange={handleChange}/>
						<Checkbox name= "sync" defaultSelected={apiBody.sync} onChange={handleChange}>
							Sincronizado
						</Checkbox>
						<Textarea label="Description" name="description" placeholder="Enter your description" defaultValue={apiBody.description} onChange={handleChange} />
					</form>
				)
			case 'DELETE':
				return(
					<div><p>Are you sure you want to delete this item?</p></div>
				)
			case 'DETAILS':
				return(
					<div>{description}</div>
				)
			default:
				return <div>No action Defined!</div>
		}

	}, [ updateModal ]);

	return (
		<div>
			<TableComponent 
				isLoading={isLoading} 
				rows={items}
				renderCell={renderCell}
				addNewItem={addNewItem}
				topContent={topContent}
				bottomContent={bottomContent}
				headerColumns={headerColumns}
				sortDescriptor={sortDescriptor}
				setSortDescriptor={setSortDescriptor}
				sortedItems={sortedItems}
				selectedKeys={selectedKeys}
				setSelectedKeys={setSelectedKeys}
			/>
			<ModalComponent 
				backdrop={'blur'}
				isOpen={isOpen}
				onClose={onClose}
				modelTitle={modelTitle}
				handleConfirm={handleConfirm}
				disableConfirm={disableConfirm}
			>
				<RenderModalBody />
			</ModalComponent>
		</div>
  	)

}
