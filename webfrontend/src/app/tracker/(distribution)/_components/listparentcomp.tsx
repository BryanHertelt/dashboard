import { DataTable } from "@/utility/extlib/datatable/data-table";

const ParentListComponent = (props: any) => {
  return (
    <div>
      <DataTable columns={props.listcolumns} data={props.listdata} />
    </div>
  );
};

export default ParentListComponent;
