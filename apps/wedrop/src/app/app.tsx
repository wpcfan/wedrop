// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Link, NavLink, NavLinkProps, Outlet, useLocation, useParams, useSearchParams } from 'react-router-dom';

interface Invoice {
  name: string;
  amount: string;
  number: number;
  due: string;
}

const invoices: Invoice[] = [
  {
    name: "Santa Monica",
    number: 1995,
    amount: "$10,800",
    due: "12/05/1995",
  },
  {
    name: "Stankonia",
    number: 2000,
    amount: "$8,000",
    due: "10/31/2000",
  },
  {
    name: "Ocean Avenue",
    number: 2003,
    amount: "$9,500",
    due: "07/22/2003",
  },
  {
    name: "Tubthumper",
    number: 1997,
    amount: "$14,000",
    due: "09/01/1997",
  },
  {
    name: "Wide Open Spaces",
    number: 1998,
    amount: "$4,600",
    due: "01/27/1998",
  },
];

const QueryNavLink = ({ to, ...props }: NavLinkProps) => {
  const location = useLocation();
  return (
    <NavLink
    to={to + location.search} {...props}
    />
  );
};

export const InvoiceDetail = () => {
  const { number } = useParams();
  if (!number) {
    return <div>Invoice not found</div>;
  }
  const invoice = invoices.find(i => i.number === parseInt(number, 10));
  if (!invoice) {
    return <div>Invoice not found</div>;
  }
  return (
    <div>
      <h1>Invoice {invoice.number}</h1>
      <p>
        <strong>{invoice.name}</strong>
        <br />
        {invoice.amount}
        <br />
        {invoice.due}
      </p>
    </div>
  );
}

export const Invoices = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <div style={{ flex: "flex"}}>
      <nav style={{
        borderRight: "solid 1px #ccc",
        padding: "1rem",
      }}>
        <input
          type="text"
          placeholder="Search"
          value={searchParams.get("search") || ''}
          onChange={(e) => {
            const search = e.target.value;
            if (search) {
              setSearchParams({ search });
            } else {
              setSearchParams({});
            }
          }}
          />
        {
          invoices
            .filter(i => {
              const search = searchParams.get("search")
              if (!search) {
                return true;
              }
              return i.name.toLowerCase().includes(search.toLowerCase());
            })
            .map(invoice => (
              <QueryNavLink
                style={({isActive}) => ({
                  display: "block",
                  margin: "1rem 0",
                  color: isActive ? "red" : "inherit",
                })}
                key={invoice.number}
                to={`/invoices/${invoice.number}`}>
                {invoice.name}
              </QueryNavLink>
            ))
        }
      </nav>
      <Outlet />
    </div>
  )
}

export const Expenses = () => {
  return (
    <main style={{ padding: "1rem 0"}}>
      <h2>Expenses</h2>
    </main>
  )
}

export const App = () => {
  return (
    <div>
      <h1>Bookkeeper</h1>
      <nav style={{
        borderBottom: "solid 1px",
        paddingBottom: "1rem"
      }}>
        <Link to="/invoices">Invoices</Link> | {" "}
        <Link to="/expenses">Expenses</Link>
      </nav>
      <Outlet></Outlet>
    </div>
  );
}

export default App;
