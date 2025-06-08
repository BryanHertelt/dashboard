export const dataColsGroups = [
  {
    accessorKey: "groupname",
    header: "Asset-Group",
    cell: ({ row }: { row: any }) => {
      const groupname: string = row.getValue("groupname");
      return <div className=""> {groupname} </div>;
    },
  },
  {
    accessorKey: "assetcount",
    header: "Asset-Count",
    cell: ({ row }: { row: any }) => {
      const assetcount: string = row.getValue("assetcount");
      return <div className=""> {assetcount} </div>;
    },
  },
];
