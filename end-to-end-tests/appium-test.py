
import os
import unittest
import time
import pymongo
from appium import webdriver
from pymongo import MongoClient
from bson.objectid import ObjectId

class MobileAppTestAppium(unittest.TestCase):

    def setUp(self):
        desired_caps = {}
        desired_caps['platformName'] = 'iOS'
        desired_caps['platformVersion'] = '11.0'
        desired_caps['deviceName'] = 'iPhone 5s'
        desired_caps['app'] = '/Users/caitlinwoods/Desktop/early-dementia-diagnosis/dementia-detect-react-app/ios/build/Build/Products/Debug-iphonesimulator/DementiaDetect.app'
        desired_caps['automationName'] = 'XCUITest'
        self.client = MongoClient("mongodb://test:test@ds013956.mlab.com:13956/alz_backend_test")
        self.db = self.client['alz_backend_test']
        result = self.db.users.delete_many({})
        result = self.db.doctors.delete_many({})
        result = self.db.patients.delete_many({})

        self.driver = webdriver.Remote('http://127.0.0.1:4723/wd/hub', desired_caps)

    #test login
    """
    Test Case: test_FRC01_login
    Purpose: Test a valid Carer login
    Expected Outcome: Should log in the user
    """
    def test_FRC01_login(self):

        # add user
        self.helper_add_user()

        loginbutton = self.driver.find_element_by_name("Log In")
        emailField = self.driver.find_element_by_name("email")
        passwordField = self.driver.find_element_by_name("password")
        self.assertTrue(loginbutton.is_displayed())
        self.assertTrue(emailField.is_displayed())
        self.assertTrue(passwordField.is_displayed())

        emailField.send_keys(['email@email.com'])
        passwordField.send_keys(['password'])
        loginbutton.click()

        time.sleep(5)

        #assert that the login was successful
        #check that the home buttons are displayed and the login button is no longer there
        homebutton = self.driver.find_element_by_name("Home")
        informationbutton = self.driver.find_element_by_name("Information")
        testsbutton = self.driver.find_element_by_name("Tests")
        settingsbutton = self.driver.find_element_by_name("Settings")
        self.assertTrue(homebutton.is_displayed())
        self.assertTrue(informationbutton.is_displayed())
        self.assertTrue(testsbutton.is_displayed())
        self.assertTrue(settingsbutton.is_displayed())
        self.assertFalse(loginbutton.is_displayed())

    """
    Test Case: test_FRC01_login_invalidEmail
    Purpose: Test an invalid login where email does not exist in database
    Expected Outcome: Should not log in the user
    """
    def test_FRC01_login_invalidEmail(self):

        self.helper_add_user();

        loginbutton = self.driver.find_element_by_name("Log In")
        emailField = self.driver.find_element_by_name("email")
        passwordField = self.driver.find_element_by_name("password");
        self.assertTrue(loginbutton.is_displayed())
        self.assertTrue(emailField.is_displayed())
        self.assertTrue(passwordField.is_displayed())

        emailField.send_keys(['invalid@email.com']);
        passwordField.send_keys(['password']);
        loginbutton.click();

        time.sleep(2);

        # assert that the login was unsuccessful
        # check that we're still on the login page and the login button is still displayed
        self.assertTrue(loginbutton.is_displayed())

    """
    Test Case: test_FRC01_login_invalidPassword
    Purpose: Test an invalid user login where the password is incorrect
    Expected Outcome: Should not log in the user
    """
    def test_FRC01_login_invalidPassword(self):

        #add user
        self.helper_add_user();

        loginbutton = self.driver.find_element_by_name("Log In")
        emailField = self.driver.find_element_by_name("email")
        passwordField = self.driver.find_element_by_name("password");
        self.assertTrue(loginbutton.is_displayed())
        self.assertTrue(emailField.is_displayed())
        self.assertTrue(passwordField.is_displayed())

        emailField.send_keys(['email@email.com']);
        passwordField.send_keys(['invalid']);
        loginbutton.click();

        time.sleep(2);

        # assert that the login was unsuccessful
        # check that we're still on the login page and the login button is still displayed
        self.assertTrue(loginbutton.is_displayed())

    # test sign up
    """
    Test Case: test_FRC02_signup
    Purpose: Test a valid user sign up
    Expected Outcome: Should sign up the user
    """
    def test_FRC02_signup(self):
        createaccountbutton = self.driver.find_element_by_name("Create Account")
        createaccountbutton.click()

        time.sleep(1)

        #enter valid credentials
        firstname = self.driver.find_element_by_name("First Name")
        lastname = self.driver.find_element_by_name("Last Name")
        email = self.driver.find_element_by_name("Email")
        password = self.driver.find_element_by_name("Password")
        confirmpassword = self.driver.find_element_by_name("Confirm Password")

        firstname.send_keys("fn")
        lastname.send_keys("ln")
        email.send_keys("email@email.com")
        password.send_keys("password")
        confirmpassword.send_keys("password")

        time.sleep(0.2)

        createaccount = self.driver.find_element_by_name("Create Account")
        createaccount.click()

        time.sleep(5)

        #assert that we have navigated back to the login screen
        loginbutton = self.driver.find_element_by_name("Log In")
        emailField = self.driver.find_element_by_name("email")
        passwordField = self.driver.find_element_by_name("password")
        self.assertTrue(loginbutton.is_displayed())
        self.assertTrue(emailField.is_displayed())
        self.assertTrue(passwordField.is_displayed())

        #assert that we can login with the user
        emailField.send_keys(['email@email.com'])
        passwordField.send_keys(['password'])
        loginbutton.click()
        time.sleep(5)
        homebutton = self.driver.find_element_by_name("Home")
        self.assertTrue(homebutton.is_displayed())
        self.assertFalse(loginbutton.is_displayed())

    """
    Test Case: test_FRC02_signup_incorrectConfirmPassword
    Purpose: Test an invalid user sign up when the "Confirm Password" field does not match the "Password" field
    Expected Outcome: Should not sign up the user
    """
    def test_FRC02_signup_incorrectConfirmPassword(self):
        createaccountbutton = self.driver.find_element_by_name("Create Account");
        createaccountbutton.click()

        time.sleep(1)

        #enter valid credentials
        firstname = self.driver.find_element_by_name("First Name")
        lastname = self.driver.find_element_by_name("Last Name")
        email = self.driver.find_element_by_name("Email")
        password = self.driver.find_element_by_name("Password")
        confirmpassword = self.driver.find_element_by_name("Confirm Password")
        createaccountbutton = self.driver.find_element_by_name("Create Account")

        firstname.send_keys("user first name")
        lastname.send_keys("user last name")
        email.send_keys("email@email.com")
        password.send_keys("password")
        confirmpassword.send_keys("incorrectpassword")

        createaccountbutton.click()

        time.sleep(5)

        #assert that we have not left the confirm account screen
        loginbutton = self.driver.find_element_by_name("Log In")
        emailField = self.driver.find_element_by_name("email")
        passwordField = self.driver.find_element_by_name("password")
        self.assertFalse(loginbutton.is_displayed())
        self.assertFalse(emailField.is_displayed())
        self.assertFalse(passwordField.is_displayed())

        #assert that an error has appeared
        error = self.driver.find_element_by_name("Error")
        self.assertTrue(error.is_displayed())

    """
    Test Case: test_FRC02_signup_missingField
    Purpose: Test an invalid user sign up when there is an expected field that is missing
    Expected Outcome: Should not sign up the user
    """
    def test_FRC02_signup_missingField(self):
        createaccountbutton = self.driver.find_element_by_name("Create Account");
        createaccountbutton.click()

        time.sleep(1)

        #enter valid credentials
        firstname = self.driver.find_element_by_name("First Name")
        lastname = self.driver.find_element_by_name("Last Name")
        email = self.driver.find_element_by_name("Email")
        password = self.driver.find_element_by_name("Password")
        confirmpassword = self.driver.find_element_by_name("Confirm Password")
        createaccountbutton = self.driver.find_element_by_name("Create Account")

        firstname.send_keys("user first name")
        #missing last name field
        email.send_keys("email@email.com")
        password.send_keys("password")
        confirmpassword.send_keys("password")

        createaccountbutton.click()

        time.sleep(5)

        #assert that we have not left the confirm account screen
        loginbutton = self.driver.find_element_by_name("Log In")
        emailField = self.driver.find_element_by_name("email")
        passwordField = self.driver.find_element_by_name("password")
        self.assertFalse(loginbutton.is_displayed())
        self.assertFalse(emailField.is_displayed())
        self.assertFalse(passwordField.is_displayed())

        #assert that an error has appeared
        error = self.driver.find_element_by_name("Error")
        self.assertTrue(error.is_displayed())

    """
    Test Case: test_FRC02_signup_userAlreadyExists
    Purpose: Test an invalid user sign up when the user already exists in the database
    Expected Outcome: Should not sign up the user
    """
    def test_FRC02_signup_userAlreadyExists(self):
        # add user
        self.helper_add_user();

        createaccountbutton = self.driver.find_element_by_name("Create Account");
        createaccountbutton.click()

        time.sleep(1)

        # enter valid credentials
        firstname = self.driver.find_element_by_name("First Name")
        lastname = self.driver.find_element_by_name("Last Name")
        email = self.driver.find_element_by_name("Email")
        password = self.driver.find_element_by_name("Password")
        confirmpassword = self.driver.find_element_by_name("Confirm Password")
        createaccountbutton = self.driver.find_element_by_name("Create Account")

        firstname.send_keys("user first name")
        lastname.send_keys("user last name")
        email.send_keys("email@email.com")
        password.send_keys("password")
        confirmpassword.send_keys("incorrectpassword")

        createaccountbutton.click()

        time.sleep(5)

        # assert that we have not left the confirm account screen
        loginbutton = self.driver.find_element_by_name("Log In")
        emailField = self.driver.find_element_by_name("email")
        passwordField = self.driver.find_element_by_name("password")
        self.assertFalse(loginbutton.is_displayed())
        self.assertFalse(emailField.is_displayed())
        self.assertFalse(passwordField.is_displayed())

        # assert that an error has appeared
        error = self.driver.find_element_by_name("Error")
        self.assertTrue(error.is_displayed())

    # test log out
    """
    Test Case: test_FRC01_logout
    Purpose: Test user logout when the "logout" button is clicked
    Expected Outcome: Should logout the user
    """
    def test_FRC01_logout(self):

        # add user
        self.helper_add_user()

        # TODO: Add patient and add test for patient when this stops working

        loginbutton = self.driver.find_element_by_name("Log In")
        emailField = self.driver.find_element_by_name("email")
        passwordField = self.driver.find_element_by_name("password")
        self.assertTrue(loginbutton.is_displayed())
        self.assertTrue(emailField.is_displayed())
        self.assertTrue(passwordField.is_displayed())

        emailField.send_keys(['email@email.com'])
        passwordField.send_keys(['password'])
        loginbutton.click()

        time.sleep(5)

        # assert that the login was successful
        # check that the home buttons are displayed and the login button is no longer there
        settingsbutton = self.driver.find_element_by_name("Settings")
        settingsbutton.click()

        time.sleep(1)

        logoutbutton = self.driver.find_element_by_name("Log Out")
        logoutbutton.click()

        time.sleep(1)

        #assert that we have returned to the login screen
        self.assertTrue(loginbutton.is_displayed())
        self.assertTrue(emailField.is_displayed())
        self.assertTrue(passwordField.is_displayed())

    # test recording test
    """
    Test Case: test_FRC08A_testRecording
    Purpose: Test user voice recording and submission
    Expected Outcome: Should record successfully and submit the recording to the doctor
    """
    def test_FRC08A_testRecording(self):

        # add user
        self.helper_add_user()

        loginbutton = self.driver.find_element_by_name("Log In")
        emailField = self.driver.find_element_by_name("email")
        passwordField = self.driver.find_element_by_name("password")
        self.assertTrue(loginbutton.is_displayed())
        self.assertTrue(emailField.is_displayed())
        self.assertTrue(passwordField.is_displayed())

        emailField.send_keys(['email@email.com'])
        passwordField.send_keys(['password'])
        loginbutton.click()

        time.sleep(5)

        testtab = self.driver.find_element_by_name("Tests")
        testtab.click()

        time.sleep(1)
        recordspeech = self.driver.find_element_by_name(" Record Speech ")
        recordspeech.click()

        #do first test
        time.sleep(1)
        recordbutton = self.driver.find_element_by_name("")
        recordbutton.ckick()
        time.sleep(0.5)
        recordbutton = self.driver.find_element_by_name("")
        recordbutton.click()

        #click next
        time.sleep(1)
        nextbutton = self.driver_element_by_name("")
        nextbutton.click();

        #click record button twice
        time.sleep(1)
        recordbutton = self.driver.find_element_by_name("")
        recordbutton.ckick()
        time.sleep(0.5)
        recordbutton = self.driver.find_element_by_name("")
        recordbutton.click()

        #click next
        time.sleep(1)
        nextbutton = self.driver_element_by_name("")
        nextbutton.click();

        #click submit
        submitbutton = self.driver_element_by_name("Submit ")

        #assert success
        success = self.driver_element_by_name("success")
        self.assertTrue(success.is_displayed())

    # test patient profiles
    """
    Test Case: test_FRC04_addNewPatient
    Purpose: Test the process of adding a new patient to the carer profile
    Expected Outcome: Should successfuly add a new patient to the carer profile
    """
    def test_FRC04_addNewPatient(self):

        # add user
        self.helper_add_user()

        #login
        loginButton = self.driver.find_element_by_name("Log In")
        emailField = self.driver.find_element_by_name("email")
        passwordField = self.driver.find_element_by_name("password")
        self.assertTrue(loginButton.is_displayed())
        self.assertTrue(emailField.is_displayed())
        self.assertTrue(passwordField.is_displayed())

        emailField.send_keys(['email@email.com'])
        passwordField.send_keys(['password'])
        loginButton.click()

        time.sleep(5)

        #add new patient
        settingsTab = self.driver.find_element_by_name("Settings")
        settingsTab.click()

        time.sleep(0.2)

        addPatient = self.driver.find_element_by_name("Add Patient")
        addPatient.click()

        time.sleep(0.2)

        # fill in patent form
        firstName = self.driver.find_element_by_name("First Name")
        lastName = self.driver.find_element_by_name("Last Name")
        gender = self.driver.find_element_by_name("Female")
        dateOfBirth = self.driver.find_element_by_name("Date of Birth")
        firstName.send_keys("first name")
        lastName.send_keys("last name")
        gender.click()
        dateOfBirth.click()
        time.sleep(0.2)
        confirm = self.driver.find_element_by_name("Confirm")
        confirm.click()
        time.sleep(0.2)
        submit = self.driver.find_element_by_name("Submit")
        submit.click()

        time.sleep(0.2)

        # assert that no errors have occured and we have navigated back to the "add patient" page
        self.assertTrue(addPatient.is_displayed())






     #test switch patient

    """
    Test Case: test_FRC04_addFirstPatient_SetPatientAsDefault
    Purpose: Tests that when first patient is added, it is set as the default patient
    Expected Outcome: Patient should be set as the default patient
    """
    def test_FRC04_addFirstPatient_SetPatientAsDefault(self):

        # add user
        self.helper_add_user()

        # login
        loginButton = self.driver.find_element_by_name("Log In")
        emailField = self.driver.find_element_by_name("email")
        passwordField = self.driver.find_element_by_name("password")
        self.assertTrue(loginButton.is_displayed())
        self.assertTrue(emailField.is_displayed())
        self.assertTrue(passwordField.is_displayed())

        emailField.send_keys(['email@email.com'])
        passwordField.send_keys(['password'])
        loginButton.click()

        time.sleep(5)

        # add new patient
        settingsTab = self.driver.find_element_by_name("Settings")
        settingsTab.click()

        time.sleep(0.2)

        addPatient = self.driver.find_element_by_name("Add Patient")
        addPatient.click()

        time.sleep(0.2)

        # fill in patent form
        firstName = self.driver.find_element_by_name("First Name")
        lastName = self.driver.find_element_by_name("Last Name")
        gender = self.driver.find_element_by_name("Female")
        dateOfBirth = self.driver.find_element_by_name("Date of Birth")
        firstName.send_keys("first name")
        lastName.send_keys("last name")
        gender.click()
        dateOfBirth.click()
        time.sleep(0.2)
        confirm = self.driver.find_element_by_name("Confirm")
        confirm.click()
        time.sleep(0.2)
        submit = self.driver.find_element_by_name("Submit")
        submit.click()

        time.sleep(0.2)

        # assert that no errors have occured and we have navigated back to the "add patient" page
        self.assertTrue(addPatient.is_displayed())
        defaultpatient = self.driver.find_element_by_name("First Patient")
        self.assertTrue(defaultpatient.is_displayed())

    """
    Test Case: test_FRC04_addPatientWithMissingField
    Purpose: Tests that if a patient is added with a missing field, an error appears and the patient is not added to the carer profile
    Expected Outcome: Error should appear and patient should not be added to the patient profile
    """
    def test_FRC04_addPatientWithMissingField_ShouldError(self):

        # add user
        self.helper_add_user()

        # login
        loginbutton = self.driver.find_element_by_name("Log In")
        emailField = self.driver.find_element_by_name("email")
        passwordField = self.driver.find_element_by_name("password")
        self.assertTrue(loginbutton.is_displayed())
        self.assertTrue(emailField.is_displayed())
        self.assertTrue(passwordField.is_displayed())

        emailField.send_keys(['email@email.com'])
        passwordField.send_keys(['password'])
        loginbutton.click()

        time.sleep(5)

        # add new patient
        settingstab = self.driver.find_element_by_name("Settings")
        settingstab.click()

        time.sleep(0.2)

        addpatient = self.driver.find_element_by_name("Add Patient")
        addpatient.click()

        time.sleep(0.2)

        # fill in patent form
        firstname = self.driver.find_element_by_name("First Name")
        lastname = self.driver.find_element_by_name("Last Name")
        gender = self.driver.find_element_by_name("Female")
        dateofbirth = self.driver.find_element_by_name("Date of Birth")
        firstname.send_keys("first name")
        #lastname.send_keys("last name")
        gender.click()
        dateofbirth.click()
        time.sleep(0.2)
        confirm = self.driver.find_element_by_name("Confirm")
        confirm.click()
        time.sleep(0.2)
        submit = self.driver.find_element_by_name("Submit")
        submit.click()

        time.sleep(0.2)

        # assert that we have not navigated back to the add patient page
        self.assertFalse(addpatient.is_displayed())

    """
    Test Case: test_FRC04_defaultPatientProfileOnLogin
    Purpose: Tests that a default patient profile appears when the user is logged in
    Expected Outcome: The last patient that was veiwed by the carer should be the default patient profile
    """
    def test_FRC04_defaultPatientProfileOnLogin(self):

        # add user and patient
        self.helper_add_user()
        self.helper_add_patient()

        # login
        loginbutton = self.driver.find_element_by_name("Log In")
        emailField = self.driver.find_element_by_name("email")
        passwordField = self.driver.find_element_by_name("password")
        self.assertTrue(loginbutton.is_displayed())
        self.assertTrue(emailField.is_displayed())
        self.assertTrue(passwordField.is_displayed())

        emailField.send_keys(['email@email.com'])
        passwordField.send_keys(['password'])
        loginbutton.click()

        time.sleep(5)

        # add new patient
        settingstab = self.driver.find_element_by_name("Settings")
        settingstab.click()
        time.sleep(0.2)

        # assert that the single patient is the default patient
        defaultpatient = self.driver.find_element_by_name("First Patient")
        self.assertTrue(defaultpatient.is_displayed())

        addpatient = self.driver.find_element_by_name("Change Patient Account")
        addpatient.click()
        time.sleep(0.2)

        # assert that the default patient is the selected patient
        selectedpatient = self.driver.find_element_by_name("First ")
        self.assertTrue(selectedpatient.is_displayed())

    """
    Test case: test_FRC04_switchPatientProfile
    Purpose: Tests the switching of a patient profile
    Expected Outcome: The patient profile is switched successfully
    """
    def test_FRC04_switchPatientProfile(self):
        # add user and patient
        self.helper_add_user()
        self.helper_add_patient()
        self.helper_add_secondPatient()

        # login
        loginbutton = self.driver.find_element_by_name("Log In")
        emailField = self.driver.find_element_by_name("email")
        passwordField = self.driver.find_element_by_name("password")
        self.assertTrue(loginbutton.is_displayed())
        self.assertTrue(emailField.is_displayed())
        self.assertTrue(passwordField.is_displayed())

        emailField.send_keys(['email@email.com'])
        passwordField.send_keys(['password'])
        loginbutton.click()

        time.sleep(5)

        # add new patient
        settingstab = self.driver.find_element_by_name("Settings")
        settingstab.click()
        time.sleep(0.2)

        # assert that the single patient is the default patient
        defaultpatient = self.driver.find_element_by_name("First Patient")
        self.assertTrue(defaultpatient.is_displayed())

        addpatient = self.driver.find_element_by_name("Change Patient Account")
        addpatient.click()
        time.sleep(0.2)

        # assert that the default patient is the selected patient
        selectedpatient = self.driver.find_element_by_name("First ")
        self.assertTrue(selectedpatient.is_displayed())

        # select the other patient
        otherpatient = self.driver.find_element_by_name("Second")
        otherpatient.click()

        newselectedPatient = self.driver.find_element_by_name("Second ")
        self.assertTrue(newselectedPatient.is_displayed())

    # test adding doctor
    """
    Test Case: test_FRD05_assignADoctor
    Purpose: Tests assigning a patient to a doctor via the correct reference key
    Expected Outcome: Patient should be successfully assigned to a doctor
    """
    def test_FRD05_assignADoctor(self):

        self.helper_add_user()
        self.helper_add_doctor()

        # login
        loginbutton = self.driver.find_element_by_name("Log In")
        emailField = self.driver.find_element_by_name("email")
        passwordField = self.driver.find_element_by_name("password")
        self.assertTrue(loginbutton.is_displayed())
        self.assertTrue(emailField.is_displayed())
        self.assertTrue(passwordField.is_displayed())

        emailField.send_keys(['email@email.com'])
        passwordField.send_keys(['password'])
        loginbutton.click()

        time.sleep(5)

        # add new patient
        settingstab = self.driver.find_element_by_name("Settings")
        settingstab.click()
        time.sleep(0.2)

        assigndoctor = self.driver.find_element_by_name("Assign a Doctor")
        assigndoctor.click()

        time.sleep(0.2)

        referencecode = self.driver.find_element_by_name("Reference Code")
        referencecode.send_keys("correctRefCode")

        submit = self.driver.find_element_by_name("Submit")
        submit.click()

        # assert that an error has not occured
        time.sleep(1)
        alert = self.driver.find_element_by_name("Alert")
        self.assertFalse(alert.is_displayed())

    """
    Test Case: test_FRD05_assignADoctor_incorrectReferenceKey
    Purpose: Tests assigning a patient to a doctor via an incorrect reference key
    Expected Outcome: The patient should not be assigned to the doctor
    """
    def test_FRD05_assignADoctor_incorrectReferenceKey(self):

        self.helper_add_user()
        self.helper_add_doctor()

        # login
        loginbutton = self.driver.find_element_by_name("Log In")
        emailField = self.driver.find_element_by_name("email")
        passwordField = self.driver.find_element_by_name("password")
        self.assertTrue(loginbutton.is_displayed())
        self.assertTrue(emailField.is_displayed())
        self.assertTrue(passwordField.is_displayed())

        emailField.send_keys(['email@email.com'])
        passwordField.send_keys(['password'])
        loginbutton.click()

        time.sleep(5)

        # add new patient
        settingstab = self.driver.find_element_by_name("Settings")
        settingstab.click()
        time.sleep(0.2)

        assigndoctor = self.driver.find_element_by_name("Assign a Doctor")
        assigndoctor.click()

        time.sleep(0.2)

        referencecode = self.driver.find_element_by_name("Reference Code")
        referencecode.send_keys("incorrectRefCode")

        submit = self.driver.find_element_by_name("Submit")
        submit.click()

        # assert that an error has not occured
        time.sleep(1)
        alert = self.driver.find_element_by_name("Alert")
        self.assertTrue(alert.is_displayed())

    def tearDown(self):
        self.driver.quit()

    def helper_add_user(self):
            result = self.db.users.insert({
                    "firstName": "firstName",
                    "lastName": "lastName",
                    "email": "email@email.com",
                    "password": "$2a$10$9Xy0cMwnn0.y/bn/SWoAGOzSGPJuzoTgsJzcHMAYsO2A3U3BLg0Iy",
                    "tests": [],
                    "patients": []
            });
            self.userId = result

    def helper_add_doctor(self):
        result = self.db.users.insert({
            "firstName": "doctorFirstName",
            "lastName": "doctorLastName",
            "email": "doctor@email.com",
            "password": "$2a$10$9Xy0cMwnn0.y/bn/SWoAGOzSGPJuzoTgsJzcHMAYsO2A3U3BLg0Iy",
            "tests": [],
            "patients": []
        })

        print(result)

        self.db.doctors.insert({
            "user": ObjectId(result),
            "referenceCode": "correctRefCode"
        })

    def helper_add_patient(self):

        self.db.patients.insert({
            "firstName": "First",
            "lastName": "Patient",
            "gender": "Female",
            "dateOfBirth": "1980-12-30T16:00:00.000Z",
            "carers": [ObjectId(self.userId)],
        });

    def helper_add_secondPatient(self):
        self.db.patients.insert({
            "firstName": "Second",
            "lastName": "Patient",
            "gender": "Female",
            "dateOfBirth": "1980-12-30T16:00:00.000Z",
            "carers": [ObjectId(self.userId)],
        });

if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(MobileAppTestAppium)
    unittest.TextTestRunner(verbosity=2).run(suite)