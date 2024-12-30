import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { orderUsers } from '../../Services/functions';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { useLocation } from "react-router-dom"
import useGetAxiosApi from '../../Hooks/useGetAxiosApi';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import axios from 'axios';
import '../../App.css';

const UsersDetailsRacheli = (props) => {

  const [values, setValues] = useState("");
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [statuses] = useState(['משתמש חסום', 'משתמש', 'מנהל']);
  const [visible, setVisible] = useState(false);
  const toast = useRef(null);

  const { data, loading: loadingPrice, error, refetch } = useGetAxiosApi('users/usersList');

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    lastName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    config: { value: null, matchMode: FilterMatchMode.EQUALS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    verified: { value: null, matchMode: FilterMatchMode.EQUALS },
    emailAddress: { value: null, matchMode: FilterMatchMode.CONTAINS }
  });

  const getUser = (id) => {
    const cookies = axios.get(`http://localhost:8000/users/getUserById/${id}`
    )
        .then(function (response) {
          setFilters({
            name: { value: response.data.accessToken.foundUser.first_name, matchMode: FilterMatchMode.CONTAINS },
            lastName: { value: response.data.accessToken.foundUser.last_name, matchMode: FilterMatchMode.CONTAINS },
            emailAddress: { value: response.data.accessToken.foundUser.email, matchMode: FilterMatchMode.EQUALS }
          })
        })
        .catch(function (error) {
        })
        .finally(function () {

        });
}

  const updateAuthorization = (authorization, id) => {
    const cookies = axios.put(`http://localhost:8000/users/authorization`, { "authorization": authorization, "id": id }
    )
      .then(function (response) {
        refetch();
      })
      .catch(function (error) {
      })
      .finally(function () {
      });
  }

  let location = useLocation();
  useEffect(() => {
    location?.state?.id&&getUser(location.state.id)
    // getUser(5)
    const tmp = orderUsers(data);
    setUsers(tmp);
    setLoading(false);
  }, [data])

  const getSeverity = (status) => {
    switch (status) {
      case 'משתמש חסום':
        return 'danger';
      case 'משתמש':
        return "help";
      case 'מנהל':
        return 'info';
    }
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const getEmailAddresses = () => {
    const verifiedUsers = users.filter(user => user.verified);
    const emailAddresses = verifiedUsers.map(user => user.emailAddress).join(',');
    window.open(`mailto:${emailAddresses}`, '_blank')
  }

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <Button className='ml-6' label='שליחת מייל לכלל המשתמשים' onClick={() => getEmailAddresses()} severity="secondary" text ></Button>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="חיפוש כללי"
          />
        </span>
      </div>
    );
  };

  const statusItemTemplate = (option) => {
    return <Tag value={option} severity={getSeverity(option)} />;
  };

  const statusRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={statusItemTemplate}
        placeholder="בחר קטגוריה"
        className="p-column-filter"
        showClear
        style={{ minWidth: '12rem' }
        }
      />
    );
  };

  const verifiedBodyTemplate = (rowData) => {
    return <i className={classNames('pi', { 'true-icon pi-check-circle': rowData.verified, 'false-icon pi-times-circle': !rowData.verified })}></i>;
  };

  const verifiedRowFilterTemplate = (options) => {
    return <TriStateCheckbox value={options.value} onChange={(e) => { options.filterApplyCallback(e.value); }} />;
  };

  const header = renderHeader();

  const footerContent = (
    <div className="flex-wrap justify-content-start align-items-left gap-3 mt-3" style={{ direction: "ltr" }}>
      <Button label="ביטול" icon="pi pi-times" severity="secondary" onClick={() => setVisible(false)} className="m-1" type="submit" raised outlined />
      <Button label="אישור" icon="pi pi-check" severity="secondary" onClick={() => { updateAuthorization(values.status == "משתמש חסום" ? 1 : 0, values.id); setVisible(false) }} className="m-1 border-1 border-bluegray-500 w-6.7rem" type="submit" raised />
    </div>
  );

  const tmp = () => {
    return (
      <> {values.status == 'משתמש' ?
        <div className="card flex justify-content-center">
          {/* <Button label="Secondary" severity="secondary" text icon="PrimeIcons.pi-lock" onClick={() => setVisible(true)} /> */}
          <Dialog header="חסימת משתמש" visible={visible} style={{ width: '50vw', direction: 'rtl' }} onHide={() => setVisible(false)} footer={footerContent}>
            <p className="mb-5">
              בלחיצה על אישור המשתמש יחסם
            </p>
            <p className="mb-5">
              משתמש חסום לא יכול להעלות כל תוכן שהוא לאתר
            </p>
            <p className="mb-5">
              כל תוכן שהמשתמש העלה ועדיין לא אושר - ימחק!
            </p>
          </Dialog>
        </div>
        :
        values.status == "משתמש חסום" ?
          <div className="card flex justify-content-center">
            {/* <Button label="Secondary" severity="secondary" text icon="pi-lock" onClick={() => setVisible(true)} /> */}
            <Dialog header="ביטול חסימת משתמש" visible={visible} style={{ width: '50vw', direction: 'rtl' }} onHide={() => setVisible(false)} footer={footerContent}>
              <p className="mb-5">
                בלחיצה על אישור חסימת המשתמש תתבטל
              </p>
              <p className="mb-5">
                התוכן שנמחק בחסימתו לא ישוחזר
              </p>
            </Dialog>
          </div>
          :
          <></>
      } </>
    )
  }

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag value={rowData.status} severity={getSeverity(rowData.status)}
        onClick={(e) => {
          setVisible(true);
          tmp();
        }} />
    );
  };

  const CustomEmailColumn = ({ rowData }) => {
    return (
      <a href={`mailto:${rowData.emailAddress}`} target="_blank" rel="noopener noreferrer">
        {rowData.emailAddress}
      </a>
    );
  };

  const emailBodyTemplate = (rowData) => {
    return <CustomEmailColumn rowData={rowData} />;
  };

  return (
    props.userAuthorization == 2 ?
      <>
        <Toast ref={toast} />
        <div className="card">
          <DataTable
            value={users}
            paginator
            rows={20}
            dataKey="id"
            filters={filters}
            filterDisplay="row"
            loading={loading}
            globalFilterFields={['name', 'lastName', 'configEmail', 'emailAddress']}
            header={header}
            emptyMessage="לא נמצאו משתמשים."
            onRowClick={(e) => { setValues(e.data) }}
            style={{ "direction": "rtl" }}
          >
            <Column
              className='text-right'
              field="name"
              header="שם פרטי"
              filter
              filterPlaceholder="חיפוש על פי שם הפרטי"
              style={{ minWidth: '12rem' }}
            />
            <Column
              className='text-right'
              field="lastName"
              header="שם משפחה"
              filter
              filterPlaceholder="חיפוש על פי שם המשפחה"
              style={{ minWidth: '12rem' }}
            />
            <Column
              className='text-right'
              field="status"
              header="הרשאות"
              showFilterMenu={false}
              filterMenuStyle={{ width: '14rem' }}
              style={{ minWidth: '12rem' }}
              body={statusBodyTemplate}
              filter
              filterElement={statusRowFilterTemplate}
            />
            <Column
              className='text-right'
              field="verified"
              header="מאשר לקבל מייל"
              dataType="boolean"
              style={{ minWidth: '6rem' }}
              body={verifiedBodyTemplate}
              filter
              filterElement={verifiedRowFilterTemplate}
            />
            <Column
              className='text-right'
              field="emailAddress"
              header="שליחת מייל למשתמש"
              // style={{ minWidth: '6rem' }}
              filter
              body={emailBodyTemplate}
              filterPlaceholder="חיפוש על פי כתובת מייל"
            />
          </DataTable>
        </div>
        {tmp()}
      </>
      :
      <>
        <h1>פדיחה! 🤨🤔😵</h1>
        <h3>לא ברור איך הגעת לכאן לכאן אבל-- </h3>
        <b>אין לך הרשאת גישה לעמוד זה.</b>
        <br></br>
        <b>props.userAuthorization: {props.userAuthorization}</b>
      </>
  );
}

export default UsersDetailsRacheli;