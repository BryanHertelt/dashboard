import { DataTable } from "@/utility/lib/design-components/datatables/table-layout/data-table";

const ParentListComponent = (props: any) => {
  return (
    <div>
      <DataTable columns={props.listcolumns} data={props.listdata} />
    </div>
  );
};

export default ParentListComponent;
