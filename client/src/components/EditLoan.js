import React, { useState, useContext, useEffect } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import AuthContext from '../auth';
// import ToggleInfo from './ToggleInfo';

const EditLoan = ({ match }) => {
    const { fetchWithCSRF, currentUser } = useContext(AuthContext);
    const loanId = Number(match.params.loanId);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [loanLengthInMonths, setLoanLengthInMonths] = useState('');
    const [monthlyPayment, setMonthlyPayment] = useState('');
    const [rerender, setRerender] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const [errors, setErrors] = useState([]);
    const [showInfo, setShowInfo] = useState({});
    const [messages, setMessages] = useState([]);
    const history = useHistory();
    const text = {
        privacy: "This controls whether or not other users will be able to see, use, and/or duplicate this loan.  (Regardless they'll not have edit/delete privileges.)",
    };

    const getLoan = () => {
        if (loanId > 0) {
            (async () => {
                try {
                    const res = await fetch(`/api/loans/${loanId}`);
                    const data = await res.json();
                    if (!res.ok) {
                        setErrors(data.errors);
                    } else {
                        setCanEdit(data.loan.user_id === currentUser.id);
                    }
                } catch (err) {
                    console.error(err)
                }
            })()
        }
    };

    useEffect(getLoan, [rerender]);

    const putLoan = () => {
        (async _ => {
            const response = await fetchWithCSRF(`/api/loans/${loanId}`, {
                method: 'PUT', headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ name, amount, interestRate, loanLengthInMonths, monthlyPayment })
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            setRerender(!rerender)
            history.push("/")
        })();
    }

    const postLoan = () => {
        (async _ => {
            const response = await fetchWithCSRF(`/api/loans`, {
                method: 'POST', headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ name, amount, interestRate, loanLengthInMonths, monthlyPayment })
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            setRerender(!rerender);
            history.push("/")
        })();
    }

    const duplicateLoan = () => {
        (async _ => {
            const response = await fetchWithCSRF(`/api/loans/${loanId}`, {method: 'POST'});
            const responseData = await response.json();
            if (!response.ok) {
                setErrors(responseData.errors);
            } else {
                if (responseData.messages) setMessages(responseData.messages);
                history.push("/");
            }
        })();
    }

    const deleteLoan = () => {
        (async _ => {
            const response = await fetchWithCSRF(`/api/loans/${loanId}`, {
                method: 'DELETE',
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            setRerender(!rerender);
            history.push("/")
        })();
    }

    const handleToggle = e => {
        let name = e.currentTarget.name;
        let newShowInfo = {...showInfo};
        newShowInfo[name] = !showInfo[name];
        setShowInfo(newShowInfo);
    }

    return !currentUser ? <Redirect to="/login" /> : (
        <>
            <h2>Loan Editor</h2>
            {errors.length ? errors.map(err => <li key={err} className="error">{err}</li>) : ''}
            <input
                type="text" placeholder="Name of new loan" value={name}
                onChange={e => setName(e.target.value)} className="larger"
                disabled={!canEdit && loanId}
            />
            <input
                type="number" placeholder="Amount" value={amount}
                onChange={e => setAmount(Number(e.target.value))} className="larger"
                disabled={!canEdit && loanId}
            />
            <input
                type="number" placeholder="Interest rate" value={interestRate}
                onChange={e => setInterestRate(Number(e.target.value))} className="larger"
                disabled={!canEdit && loanId}
            />

            <input
                type="number" placeholder="Loan length (in months)" value={loanLengthInMonths}
                onChange={e => setLoanLengthInMonths(Number(e.target.value))} className="larger"
                disabled={!canEdit && loanId}
            />

            <input
                type="number" placeholder="Monthly payment" value={monthlyPayment}
                onChange={e => setMonthlyPayment(Number(e.target.value))} className="larger"
                disabled={!canEdit && loanId}
            />

            {(loanId) ? null : (
                <>
                    <button onClick={loanId ? putLoan : postLoan}>
                        <h3>{loanId ? "Submit changes" : "Create loan"}</h3>
                    </button>
                </>
            )}

            {!loanId ? null :
                <>
                    <>{messages.map(err => <li key={err}>{err}</li>)}</>
                    <h4>Would you like to duplicate
                        {!canEdit && loanId ? " " :
                        " or delete "}
                        this loan?</h4>
                    <span>
                        <button onClick={() => duplicateLoan()}><h3>duplicate</h3></button>
                        {!canEdit && loanId ? null :
                        <button onClick={() => deleteLoan()}><h3>delete</h3></button>}
                    </span>
                </>
            }
        </>
    );
};
export default EditLoan;
