import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../auth';

const Loans = () => {
    const [loans, setLoans] = useState([]);
    const [loanIds, setLoanIds] = useState([]);
    const [rerender, setRerender]=useState(false);
    const [, setMessages]=useState([]);
    const [, setErrors]   = useState([]);
    const { currentUser, fetchWithCSRF } = useContext(AuthContext)

    const getLoans = async () => {
        try {
            const res = await fetch(`/api/loans`)
            if (res.ok) {
                const data = await res.json();
                setLoans(data.loans);
                setLoanIds(data.loans.map(loan => loan.id));
            }
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        getLoans();
    }, [rerender])

    const duplicateLoan = loanId => {
        (async _ => {
            const response = await fetchWithCSRF(`/api/loans/${loanId}`, {
                method: 'POST',
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            setRerender(!rerender);
        })();
    }

    return (
        <>
            <h3>
                {loans.length ? `My loans:` : `I have no loans now.`}
            </h3>
            {!currentUser ? null :
                <NavLink exact to={"/loans/edit/0"} className="nav" activeClassName="active">
                    create new loan
                </NavLink>
            }
            <ul>
                {loans.map(loan => (
                    <li key={loan.id}>
                        <>
                            <NavLink to={`/loans/edit/${loan.id}`}>
                                edit
                            </NavLink>
                            <NavLink to={`/loans/${loan.id}`}>
                                {loan.name}
                            </NavLink>
                        </>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default Loans
