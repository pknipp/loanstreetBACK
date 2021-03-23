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
            amount=request.json.get('amount', None),
            interest_rate=request.json.get('interestRate', None),
            loan_length_in_months=request.json.get('loanLengthInMonths', None),
            monthly_payment=request.json.get('monthlyPayment', None),
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        db.session.add(new_loan)
        db.session.commit()
        return {"message": "successfully added a loan"}

    if request.method == 'GET':
        return {"loans": [loan.to_dict() for loan in Loan.query]}
