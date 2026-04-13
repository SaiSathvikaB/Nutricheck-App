import pandas as pd
import math
from scipy.stats import norm
import os

# -----------------------
# Load datasets (ONCE)
# -----------------------

BASE_DIR = os.path.dirname(__file__)

bmi_file = os.path.join(BASE_DIR, "bmi-agerev.xls")
wfa_child_file = os.path.join(BASE_DIR, "wt-age.xls")
wfa_infant_file = os.path.join(BASE_DIR, "wt-ageinf.xls")


bmi_df = pd.read_excel(bmi_file, engine="xlrd")
wfa_child_df = pd.read_excel(wfa_child_file, engine="xlrd")
wfa_infant_df = pd.read_excel(wfa_infant_file, engine="xlrd")

# Clean column names (IMPORTANT)
for df in [bmi_df, wfa_child_df, wfa_infant_df]:
    df.columns = df.columns.str.strip()


# -----------------------
# Helpers
# -----------------------

def gender_to_sex(gender):
    """
    Converts:
    1 → male
    2 → female
    OR string → male/female
    """
    if isinstance(gender, int):
        return gender
    return 1 if gender.lower() == "male" else 2


def get_row(df, age_months, sex):
    df = df[df["Sex"] == sex].copy()

    df["diff"] = abs(df["Agemos"] - age_months)
    row = df.loc[df["diff"].idxmin()]

    return row


def lms_zscore(value, L, M, S):
    if L == 0:
        return math.log(value / M) / S
    return ((value / M) ** L - 1) / (L * S)


def z_to_percentile(z):
    return norm.cdf(z) * 100


# -----------------------
# MAIN FUNCTION
# -----------------------

def assess_bmi(age, gender, height_cm, weight_kg):
    age_months = age * 12
    sex = gender_to_sex(gender)

    height_m = height_cm / 100
    bmi = weight_kg / (height_m ** 2)

    result = {
        "bmi": round(bmi, 2),
    }

    # -----------------------
    # ADULTS (>=20 years)
    # -----------------------
    if age >= 20:
        if bmi < 18.5:
            category = "Underweight"
            severity = "Mild"
        elif bmi < 25:
            category = "Healthy"
            severity = "Healthy"
        elif bmi < 30:
            category = "Overweight"
            severity = "Moderate"
        else:
            category = "Obese"
            severity = "High"

        result.update({
            "category": category,
            "severity": severity,
            "type": "adult",
            "keywords": []
        })

        return result

    # -----------------------
    # CHILDREN (BMI-for-age)
    # -----------------------
    try:
        bmi_row = get_row(bmi_df, age_months, sex)

        bmi_z = lms_zscore(bmi, bmi_row["L"], bmi_row["M"], bmi_row["S"])
        bmi_percentile = z_to_percentile(bmi_z)

        result["bmi_percentile"] = round(bmi_percentile, 2)

        if bmi_percentile < 5:
            bmi_status = "Underweight"
        elif bmi_percentile < 85:
            bmi_status = "Healthy"
        elif bmi_percentile < 95:
            bmi_status = "Overweight"
        else:
            bmi_status = "Obese"

    except Exception:
        bmi_status = "Unknown"

    # -----------------------
    # Weight-for-age
    # -----------------------
    try:
        if age <= 3:
            row = get_row(wfa_infant_df, age_months, sex)
        else:
            row = get_row(wfa_child_df, age_months, sex)

        w_z = lms_zscore(weight_kg, row["L"], row["M"], row["S"])
        w_percentile = z_to_percentile(w_z)

        result["weight_percentile"] = round(w_percentile, 2)

        if w_percentile < 5:
            weight_status = "Underweight"
        else:
            weight_status = "Healthy"

    except Exception:
        weight_status = "Unknown"

    # -----------------------
    # FINAL DECISION LOGIC
    # -----------------------
    if bmi_status == "Underweight" and weight_status == "Underweight":
        final = "Severe Malnutrition"
        keywords = ["severe_wasting", "failure_to_thrive"]

    elif bmi_status == "Underweight":
        final = "Wasting"
        keywords = ["low_bmi"]

    elif weight_status == "Underweight":
        final = "Underweight"
        keywords = ["weight_deficiency"]

    elif bmi_status == "Overweight":
        final = "Overweight Risk"
        keywords = ["high_bmi"]

    elif bmi_status == "Obese":
        final = "Obese"
        keywords = ["obesity"]

    else:
        final = "Healthy"
        keywords = []

    result.update({
        "category": final,
        "severity": final,
        "type": "child",
        "keywords": keywords
    })

    return result