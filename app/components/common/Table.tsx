import React from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button } from "@nextui-org/react";
import { TableProps } from "@/types";

export function TableComponent({isLoading, renderCell , headerColumns, topContent, bottomContent, sortDescriptor, setSortDescriptor, sortedItems, selectedKeys, setSelectedKeys }: TableProps) {
	if(isLoading){
		return <h3>Loading...</h3>
	}else{
		return (
			<Table  aria-label="Table" 
					topContent={topContent} 
					topContentPlacement="inside" 
					bottomContent= {bottomContent} 
					bottomContentPlacement="inside" 
					isCompact
					sortDescriptor={sortDescriptor}
					onSortChange={setSortDescriptor}
					selectedKeys={selectedKeys}
					selectionMode="multiple"
					onSelectionChange={setSelectedKeys}
			>
			  <TableHeader columns={headerColumns}>
				{(column) => (
					<TableColumn  
						key={String(column.key)}
						align={column.key === "actions" ? "center" : "start"}
           				allowsSorting={column.sortable}
					>
						{column.label}
					</TableColumn>
				)}
			  </TableHeader>
			  <TableBody items={sortedItems} emptyContent={'No rows to display.'}>
				{(item) => (
				  <TableRow key={item._id}>
					{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
				  </TableRow>
				)}
			  </TableBody>
			</Table>
		  );
	}
}
