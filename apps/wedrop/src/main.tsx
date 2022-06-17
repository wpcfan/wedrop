import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { App, Expenses, InvoiceDetail, Invoices } from './app/app';
import { Main, Room } from './app/pages';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path='/' element={<App/>}>
          <Route path='expenses' element={<Expenses/>}></Route>
          <Route path='invoices' element={<Invoices/>}>
            <Route index element={
              <main style={{ padding: "1rem" }}>
                <p>Select an invoice</p>
              </main>
            }></Route>
            <Route path=':number' element={<InvoiceDetail/>}></Route>
          </Route>
          <Route path='chat' element={<Main/>}>
            <Route path=':room' element={<Room/>}></Route>
          </Route>
          <Route path='*' element={<div>404</div>}></Route>
        </Route>
      </Routes>
    </Router>
  </StrictMode>
);
