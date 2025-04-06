import TableList from "@/app/(pages)/components/TableList";

export type TUser = {
  id: string;
  name: string;
  balance: number;
  email: string;
  registerAt: Date;
  active: boolean;
};

export default function Home() {
  return (
    <main>
      <div className="container">
        <TableList />
      </div>
    </main>
  );
}
