from flask import Blueprint, request, redirect
from loanstreet.models import db, User, Loan
from flask_login import current_user
from datetime import datetime

loans = Blueprint('loans', __name__)

@loans.route('', methods=['POST', 'GET'])
def index():

    if request.method == 'POST':
        if not request.is_json:
            return jsonify({"message": "Missing JSON in request"}), 400
        new_loan = Loan(
            user_id=current_user.id,
            name=request.json.get('name', None),
            amount=request.json.get('amount', None),
            interest_rate=request.json.get('interestRate', None),
            length_in_months=request.json.get('lengthInMonths', None),
            monthly_payment=request.json.get('monthlyPayment', None),
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        db.session.add(new_loan)
        db.session.commit()
        return {"message": "successfully added a loan"}

    if request.method == 'GET':
        loans = Loan.query.filter(Loan.user_id == current_user.id)
        return {"loans": [loan.to_dict() for loan in loans]}

@loans.route('/<loan_id>', methods=['POST', 'GET', 'DELETE', 'PUT'])
def one(loan_id):
    loan = Loan.query.get(int(loan_id))
    if not loan.user_id == current_user.id:
        return {"errors": ["You are not authorized to access this question."]}, 401

    # duplicating a loan
    if request.method == 'POST':
        new_loan = Loan(
            user_id=current_user.id,
            name='COPY OF ' + loan.name,
            amount=loan.amount,
            interest_rate=loan.interest_rate,
            length_in_months=loan.length_in_months,
            monthly_payment=loan.monthly_payment,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        db.session.add(new_loan)
        db.session.commit()
        return {"message": "success"}

    if request.method == 'GET':
        return loan.to_dict()

    if request.method == 'PUT':
        if not request.is_json:
            return jsonify({"message": "Missing JSON in request"}), 400
        loan.name = request.json.get('name', None)
        loan.amount = request.json.get('amount', None)
        loan.interest_rate = request.json.get('interestRate', None)
        loan.length_in_months = request.json.get('lengthInMonths', None)
        loan.monthly_payment = request.json.get('monthlyPayment', None)
        loan.updated_at = datetime.now()

        db.session.commit()
        return {"message": "I hope that you like the new details for this loan."}

    if request.method == 'DELETE':
        db.session.delete(loan)
        db.session.commit()
        return {"message": "I hope that you no longer need this loan."}
