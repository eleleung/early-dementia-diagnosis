import unittest
import time
from appium import webdriver
from pymongo import MongoClient
from bson.objectid import ObjectId


class MobileAppTestAppium(unittest.TestCase):
    def setUp(self):
        desired_caps = {'platformName': 'iOS',
                        'platformVersion': '11.1',
                        'deviceName': 'iPhone 6',
                        'app': '/Users/caitlinwoods/Desktop/early-dementia-diagnosis/dementia-detect-react-app'
                               '/ios/build/Build/Products/Debug-iphonesimulator/DementiaDetect.app',
                        'automationName': 'XCUITest'}
        self.client = MongoClient("mongodb://test:test@ds013956.mlab.com:13956/alz_backend_test")
        self.db = self.client['alz_backend_test']
        self.db.users.delete_many({})
        self.db.doctors.delete_many({})
        self.db.patients.delete_many({})
        self.db.tests.delete_many({})
        self.db.testresults.delete_many({})

        self.driver = webdriver.Remote('http://127.0.0.1:4723/wd/hub', desired_caps)

    # FRC01 - test login
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
        # click off the keyboard
        self.driver.find_element_by_name('email').click()
        passwordField.send_keys(['password'])
        loginbutton.click()

        wait = 0
        while loginbutton.is_displayed() and wait < 30:
            time.sleep(1)
            wait += 1

        # assert that the login was successful
        # check that the home buttons are displayed and the login button is no longer there
        self.assertTrue(self.driver.find_element_by_name("Home").is_displayed())
        self.assertTrue(self.driver.find_element_by_name("Assigned Tests").is_displayed())
        self.assertTrue(self.driver.find_element_by_name("Completed Tests").is_displayed())
        self.assertTrue(self.driver.find_element_by_name("Settings").is_displayed())
        self.assertFalse(loginbutton.is_displayed())

    """
    Test Case: test_FRC01_login_invalidEmail
    Purpose: Test an invalid login where email does not exist in database
    Expected Outcome: Should not log in the user
    """
    def test_FRC01_login_invalidEmail(self):
        self.helper_add_user()
        loginbutton = self.driver.find_element_by_name("Log In")
        emailField = self.driver.find_element_by_name("email")
        passwordField = self.driver.find_element_by_name("password")
        self.assertTrue(loginbutton.is_displayed())
        self.assertTrue(emailField.is_displayed())
        self.assertTrue(passwordField.is_displayed())

        emailField.send_keys(['invalid@email.com'])
        self.driver.find_element_by_name('Email').click()  # click off the keyboard
        passwordField.send_keys(['password'])
        loginbutton.click()

        time.sleep(2)

        # assert that the login was unsuccessful
        # check that we're still on the login page and the login button is still displayed
        self.assertTrue(self.driver.find_element_by_name('Alert'));

    """
    Test Case: test_FRC01_login_invalidPassword
    Purpose: Test an invalid user login where the password is incorrect
    Expected Outcome: Should not log in the user
    """
    def test_FRC01_login_invalidPassword(self):
        # add user
        self.helper_add_user()

        loginbutton = self.driver.find_element_by_name("Log In")
        emailField = self.driver.find_element_by_name("email")
        passwordField = self.driver.find_element_by_name("password")
        self.assertTrue(loginbutton.is_displayed())
        self.assertTrue(emailField.is_displayed())
        self.assertTrue(passwordField.is_displayed())

        emailField.send_keys(['email@email.com'])
        self.driver.find_element_by_name('email').click()  # click off the keyboard
        passwordField.send_keys(['invalid'])
        loginbutton.click()

        time.sleep(2)

        # assert that the login was unsuccessful
        # check that we're still on the login page and the login button is still displayed
        self.assertTrue(self.driver.find_element_by_name("Alert"))

    """
    Test Case: test_FRC01_logout
    Purpose: Test user logout when the "logout" button is clicked
    Expected Outcome: Should logout the user
    """
    def test_FRC01_logout(self):

        # add user
        self.helper_add_user()

        loginbutton = self.driver.find_element_by_name("Log In")
        emailField = self.driver.find_element_by_name("email")
        passwordField = self.driver.find_element_by_name("password")

        emailField.send_keys(['email@email.com'])
        # click off the keyboard
        self.driver.find_element_by_name('email').click()
        passwordField.send_keys(['password'])
        loginbutton.click()

        wait = 0
        while loginbutton.is_displayed() and wait < 30:
            time.sleep(1)
            wait += 1

        # assert that the login was successful
        # check that the home buttons are displayed and the login button is no longer there
        self.driver.find_element_by_name("Settings").click()
        logoutbutton = self.driver.find_element_by_name("Log Out")
        logoutbutton.click()

        wait = 0
        while logoutbutton.is_displayed() and wait < 30:
            time.sleep(1)
            wait += 1

        # assert that we have returned to the login screen
        self.assertTrue(loginbutton.is_displayed())
        self.assertTrue(emailField.is_displayed())
        self.assertTrue(passwordField.is_displayed())

    # FRC02 - test sign up
    """
    Test Case: test_FRC02_signup
    Purpose: Test a valid user sign up
    Expected Outcome: Should sign up the user
    """
    def test_FRC02_signup(self):
        self.driver.find_element_by_name("Create Account").click()

        # enter valid credentials
        name = self.driver.find_element_by_name("First Name")
        name.send_keys("fn")
        self.driver.find_element_by_name("Last Name").send_keys("ln")
        self.driver.find_element_by_name("Email").send_keys("email@email.com")
        self.driver.find_element_by_name("Password").send_keys("password")
        self.driver.find_element_by_name("Confirm Password").send_keys("password")

        self.driver.find_elements_by_name("Create Account")[2].click()

        wait = 0
        while name.is_displayed() and wait < 30:
            time.sleep(1)
            wait += 1

        # assert that we have navigated back to the login screen
        loginbutton = self.driver.find_element_by_name("Log In")
        emailField = self.driver.find_element_by_name("email")
        passwordField = self.driver.find_element_by_name("password")
        self.assertTrue(loginbutton.is_displayed())
        self.assertTrue(emailField.is_displayed())
        self.assertTrue(passwordField.is_displayed())

        # assert that we can login with the user
        emailField.send_keys(['email@email.com'])
        # click off keyboard
        self.driver.find_element_by_name('email').click()
        passwordField.send_keys(['password'])
        loginbutton.click()

        wait = 0
        while loginbutton.is_displayed() and wait < 30:
            time.sleep(1)
            wait += 1

        homebutton = self.driver.find_element_by_name("Home")
        self.assertTrue(homebutton.is_displayed())
        self.assertFalse(loginbutton.is_displayed())

    """
    Test Case: test_FRC02_signup_incorrectConfirmPassword
    Purpose: Test an invalid user sign up when the "Confirm Password" field does not match the "Password" field
    Expected Outcome: Should not sign up the user
    """
    def test_FRC02_signup_incorrectConfirmPassword(self):
        self.driver.find_element_by_name("Create Account").click()

        # enter valid credentials
        name = self.driver.find_element_by_name("First Name")
        name.send_keys("fn")
        self.driver.find_element_by_name("Last Name").send_keys("ln")
        self.driver.find_element_by_name("Email").send_keys("email@email.com")
        self.driver.find_element_by_name("Password").send_keys("password")
        self.driver.find_element_by_name("Confirm Password").send_keys("incorrect")

        self.driver.find_elements_by_name("Create Account")[2].click()

        time.sleep(2)

        # assert that an error has appeared
        error = self.driver.find_element_by_name("Alert")
        self.assertTrue(error.is_displayed())

    """
    Test Case: test_FRC02_signup_missingField
    Purpose: Test an invalid user sign up when there is an expected field that is missing
    Expected Outcome: Should not sign up the user
    """
    def test_FRC02_signup_missingField(self):
        self.driver.find_element_by_name("Create Account").click()

        # enter valid credentials
        name = self.driver.find_element_by_name("First Name")
        name.send_keys("fn")
        # missing last name field
        # self.driver.find_element_by_name("Last Name").send_keys("ln")
        self.driver.find_element_by_name("Email").send_keys("email@email.com")
        self.driver.find_element_by_name("Password").send_keys("password")
        self.driver.find_element_by_name("Confirm Password").send_keys("password")

        self.driver.find_elements_by_name("Create Account")[2].click()

        time.sleep(2)

        # assert that an error has appeared
        error = self.driver.find_element_by_name("Alert")
        self.assertTrue(error.is_displayed())

    """
    Test Case: test_FRC02_signup_userAlreadyExists
    Purpose: Test an invalid user sign up when the user already exists in the database
    Expected Outcome: Should not sign up the user
    """
    def test_FRC02_signup_userAlreadyExists(self):

        # add an existing user
        self.helper_add_user()

        self.driver.find_element_by_name("Create Account").click()

        # enter valid credentials
        name = self.driver.find_element_by_name("First Name").send_keys("fn")
        # missing last name field
        self.driver.find_element_by_name("Last Name").send_keys("ln")
        self.driver.find_element_by_name("Email").send_keys("email@email.com")
        self.driver.find_element_by_name("Password").send_keys("password")
        self.driver.find_element_by_name("Confirm Password").send_keys("password")

        self.driver.find_elements_by_name("Create Account")[2].click()

        time.sleep(2)

        # assert that an error has appeared
        error = self.driver.find_element_by_name("Alert")
        self.assertTrue(error.is_displayed())

    # FRC03 - test home page
    """
    Test Case: test_FRC03_homepageAppearsOnLogin
    Purpose: tests that a homepage appears after the user has logged in
    Expected Outcome: User can see the home page
    """
    def test_FRC03_homepageAppearsOnLogin(self):
        # add user
        self.helper_add_user()

        self.driver.find_element_by_name("email").send_keys(['email@email.com'])
        # click off the keyboard
        self.driver.find_element_by_name('email').click()
        self.driver.find_element_by_name("password").send_keys(['password'])
        loginbutton = self.driver.find_element_by_name('Log In')
        loginbutton.click()

        wait = 0
        while loginbutton.is_displayed() and wait < 30:
            time.sleep(1)
            wait += 1

        # assert the home page is displayed
        self.assertTrue(self.driver.find_element_by_name("Your Stats").is_displayed())
        self.assertTrue(self.driver.find_element_by_name("News").is_displayed())

    # FRC04 - Add new patients
    """
    Test Case: test_FRC04_addNewPatient
    Purpose: Test the process of adding a new patient to the carer profile
    Expected Outcome: Should successfully add a new patient to the carer profile
    """
    def test_FRC04_addNewPatient(self):

        # add user
        self.helper_add_user()

        # login
        self.driver.find_element_by_name("email").send_keys(['email@email.com'])
        # click off keyboard
        self.driver.find_element_by_name('email').click()
        self.driver.find_element_by_name("password").send_keys(['password'])
        loginbutton = self.driver.find_element_by_name("Log In")
        loginbutton.click()

        wait = 0
        while loginbutton.is_displayed() and wait < 30:
            time.sleep(1)
            wait += 1

        # add new patient
        self.driver.find_element_by_name("Settings").click()
        self.driver.find_element_by_name(" Add Patient ").click()

        # fill in patent form
        self.driver.find_element_by_name("First Name").send_keys("first name")
        self.driver.find_element_by_name("Last Name").send_keys("last name")
        self.driver.find_element_by_name("Female").click()
        self.driver.find_element_by_name("Date of Birth").click()
        self.driver.find_element_by_name("Confirm").click()
        submit = self.driver.find_element_by_name("Submit")
        submit.click()

        wait = 0
        while submit.is_displayed() and wait < 30:
            time.sleep(1)
            wait += 1

        # assert that no errors have occured and we have navigated back to the "Settings" page
        self.assertTrue(self.driver.find_element_by_name("Patient Account").is_displayed())

    """
    Test Case: test_FRC04_addFirstPatient_AutomaticallySetPatientAsCurrentPatientProfile
    Purpose: Tests that when first patient is added, it is set as the default patient
    Expected Outcome: Patient should be set as the default patient
    """
    def test_FRC04_addFirstPatient_AutomaticallySetPatientAsCurrentPatientProfile(self):
        # add user
        self.helper_add_user()

        # login
        self.driver.find_element_by_name("email").send_keys(['email@email.com'])
        # click off keyboard
        self.driver.find_element_by_name('email').click()
        self.driver.find_element_by_name("password").send_keys(['password'])
        loginbutton = self.driver.find_element_by_name("Log In")
        loginbutton.click()

        wait = 0
        while loginbutton.is_displayed() and wait < 30:
            time.sleep(1)
            wait += 1

        # add new patient
        self.driver.find_element_by_name("Settings").click()
        self.driver.find_element_by_name(" Add Patient ").click()

        # fill in patent form
        self.driver.find_element_by_name("First Name").send_keys("first name")
        self.driver.find_element_by_name("Last Name").send_keys("last name")
        self.driver.find_element_by_name("Female").click()
        self.driver.find_element_by_name("Date of Birth").click()
        self.driver.find_element_by_name("Confirm").click()
        submit = self.driver.find_element_by_name("Submit")
        submit.click()

        wait = 0
        while submit.is_displayed() and wait < 30:
            time.sleep(1)
            wait += 1

        # assert that the current patient profile is the profile of the newly added patient
        self.assertTrue(self.driver.find_element_by_name("Patient Account").is_displayed())
        self.assertTrue(self.driver.find_element_by_name("Current Patient: first name last name").is_displayed())

    """
    Test Case: test_FRC04_addPatientWithMissingField
    Purpose: Tests that if a patient is added with a missing field, an error appears and the patient is not added to the
        carer profile
    Expected Outcome: Error should appear and patient should not be added to the patient profile
    """
    def test_FRC04_addPatientWithMissingField_ShouldNotAddPatient(self):
        # add user
        self.helper_add_user()

        # login
        self.driver.find_element_by_name("email").send_keys(['email@email.com'])
        # click off keyboard
        self.driver.find_element_by_name('email').click()
        self.driver.find_element_by_name("password").send_keys(['password'])
        loginbutton = self.driver.find_element_by_name("Log In")
        loginbutton.click()

        wait = 0
        while loginbutton.is_displayed() and wait < 30:
            time.sleep(1)
            wait += 1

        # add new patient
        self.driver.find_element_by_name("Settings").click()
        self.driver.find_element_by_name(" Add Patient ").click()

        # fill in patent form
        self.driver.find_element_by_name("First Name").send_keys("first name")
        # missing field
        # self.driver.find_element_by_name("Last Name").send_keys("last name")
        self.driver.find_element_by_name("Female").click()
        self.driver.find_element_by_name("Date of Birth").click()
        self.driver.find_element_by_name("Confirm").click()
        submit = self.driver.find_element_by_name("Submit")
        submit.click()

        time.sleep(1)

        # assert that error has appeared
        self.assertTrue(self.driver.find_element_by_name("Alert"))

    """
    Test Case: test_FRC04_defaultPatientProfileOnLogin
    Purpose: Tests that a default patient profile appears when the user is logged in
    Expected Outcome: The last patient that was veiwed by the carer should be the default patient profile
    """
    def test_FRC04_defaultPatientProfileOnLogin(self):
        # add user
        self.helper_add_user()

        # login
        self.driver.find_element_by_name("email").send_keys(['email@email.com'])
        # click off keyboard
        self.driver.find_element_by_name('email').click()
        self.driver.find_element_by_name("password").send_keys(['password'])
        loginbutton = self.driver.find_element_by_name("Log In")
        loginbutton.click()

        wait = 0
        while loginbutton.is_displayed() and wait < 30:
            time.sleep(1)
            wait += 1

        # add new patient
        self.driver.find_element_by_name("Settings").click()
        self.driver.find_element_by_name(" Add Patient ").click() # TODO: set identifier for Add Patient

        # fill in patent form
        self.driver.find_element_by_name("First Name").send_keys("first name")
        self.driver.find_element_by_name("Last Name").send_keys("last name")
        self.driver.find_element_by_name("Female").click()
        self.driver.find_element_by_name("Date of Birth").click()
        self.driver.find_element_by_name("Confirm").click()
        submit = self.driver.find_element_by_name("Submit")
        submit.click()

        wait = 0
        while submit.is_displayed() and wait < 30:
            time.sleep(1)
            wait += 1

        # logout and login again
        self.driver.find_element_by_name("Log Out").click()
        self.driver.find_element_by_name("email").send_keys(['email@email.com'])
        # click off keyboard
        self.driver.find_element_by_name('email').click()
        self.driver.find_element_by_name("password").send_keys(['password'])
        loginbutton = self.driver.find_element_by_name("Log In")
        loginbutton.click()

        wait = 0
        while loginbutton.is_displayed() and wait < 30:
            time.sleep(1)
            wait += 1

        self.driver.find_element_by_name("Settings").click()

        # assert that the current patient profile is the profile of the newly added patient
        self.assertTrue(self.driver.find_element_by_name("Current Patient: first name last name").is_displayed())

    # FRC05 - Switch patient profile
    """
    Test case: test_FRC04_switchPatientProfile
    Purpose: Tests the switching of a patient profile
    Expected Outcome: The patient profile is switched successfully
    """
    def test_FRC05_switchPatientProfile(self):
        # add user and patient
        self.helper_add_user()
        self.helper_add_patient()
        self.helper_add_secondPatient()

        # login
        self.driver.find_element_by_name("email").send_keys(['email@email.com'])
        self.driver.find_element_by_name("email").click()
        self.driver.find_element_by_name("password").send_keys(['password'])
        loginbutton = self.driver.find_element_by_name("Log In")
        loginbutton.click()

        wait = 0
        while loginbutton.is_displayed() and wait < 30:
            time.sleep(1)
            wait += 1

        self.driver.find_element_by_name("Settings").click()

        # assert that the default patient is the selected patient
        self.assertTrue(self.driver.find_element_by_name("Current Patient: First Patient").is_displayed())

        self.driver.find_element_by_name(" Change Patient Account ").click() # TODO: Add identifier for change patient account

        # select the other patient
        self.driver.find_element_by_accessibility_id("Second Patient").click()
        self.driver.find_element_by_name("Settings").click()

        # assert that the current patient profile is now the second patient
        self.assertTrue(self.driver.find_element_by_name("Current Patient: Second Patient").is_displayed())

    # FRD05 - test adding doctor
    """
    Test Case: test_FRD05_assignADoctor
    Purpose: Tests assigning a patient to a doctor via the correct reference key
    Expected Outcome: Patient should be successfully assigned to a doctor
    """
    def test_FRD05_assignADoctor(self):
        self.helper_add_user()
        self.helper_add_doctor()

        # login
        self.driver.find_element_by_name("email").send_keys(['email@email.com'])
        self.driver.find_element_by_name("email").click()
        self.driver.find_element_by_name("password").send_keys(['password'])
        loginbutton = self.driver.find_element_by_name("Log In")
        loginbutton.click()

        wait = 0
        while loginbutton.is_displayed() and wait < 30:
            time.sleep(1)
            wait += 1

        #add a patient
        self.driver.find_element_by_name("Settings").click()
        self.driver.find_element_by_name(" Add Patient ").click() # TODO: Create an ID for Add Patient
        self.driver.find_element_by_name("First Name").send_keys("first name")
        self.driver.find_element_by_name("Last Name").send_keys("last name")
        self.driver.find_element_by_name("Female").click()
        self.driver.find_element_by_name("Date of Birth").click()
        self.driver.find_element_by_name("Confirm").click()
        submit = self.driver.find_element_by_name("Submit")
        submit.click()

        wait = 0
        while submit.is_displayed() and wait < 30:
            time.sleep(1)
            wait += 1

        self.driver.find_element_by_name(" Assign a Doctor ").click() # TODO: Create an ID for assign a doctor
        self.driver.find_element_by_name("Reference Code").send_keys("correctRefCode")
        submit = self.driver.find_element_by_name("Submit")
        submit.click()

        time.sleep(5)

        # assert that an error has not occured
        self.assertTrue(self.driver.find_element_by_name("Settings").is_displayed())

    """
    Test Case: test_FRD05_assignADoctor_incorrectReferenceKey
    Purpose: Tests assigning a patient to a doctor via an incorrect reference key
    Expected Outcome: The patient should not be assigned to the doctor
    """
    def test_FRD05_assignADoctor_incorrectReferenceKey(self):
        self.helper_add_user()
        self.helper_add_doctor()

        # login
        self.driver.find_element_by_name("email").send_keys(['email@email.com'])
        self.driver.find_element_by_name("email").click()
        self.driver.find_element_by_name("password").send_keys(['password'])
        loginbutton = self.driver.find_element_by_name("Log In")
        loginbutton.click()

        wait = 0
        while loginbutton.is_displayed() and wait < 30:
            time.sleep(1)
            wait += 1

        #add a patient
        self.driver.find_element_by_name("Settings").click()
        self.driver.find_element_by_name(" Add Patient ").click() # TODO: Create an ID for Add Patient
        self.driver.find_element_by_name("First Name").send_keys("first name")
        self.driver.find_element_by_name("Last Name").send_keys("last name")
        self.driver.find_element_by_name("Female").click()
        self.driver.find_element_by_name("Date of Birth").click()
        self.driver.find_element_by_name("Confirm").click()
        submit = self.driver.find_element_by_name("Submit")
        submit.click()

        wait = 0
        while submit.is_displayed() and wait < 30:
            time.sleep(1)
            wait += 1

        self.driver.find_element_by_name(" Assign a Doctor ").click() # TODO: Create an ID for assign a doctor
        # add an incorrect reference code
        self.driver.find_element_by_name("Reference Code").send_keys("incorrectRefCode")
        submit = self.driver.find_element_by_name("Submit")
        submit.click()

        # assert that an error has not occured
        time.sleep(1)
        alert = self.driver.find_element_by_name("Alert")
        self.assertTrue(alert.is_displayed())

    """
    Test Case: test_FRD05_assignADoctor_incorrectReferenceKey
    Purpose: Tests assigning a patient to a doctor via a blank reference key
    Expected Outcome: The patient should not be assigned to the doctor
    """
    def test_FRD05_assignADoctor_blankReferenceKey(self):
        self.helper_add_user()
        self.helper_add_doctor()

        # login
        self.driver.find_element_by_name("email").send_keys(['email@email.com'])
        self.driver.find_element_by_name("email").click()
        self.driver.find_element_by_name("password").send_keys(['password'])
        loginbutton = self.driver.find_element_by_name("Log In")
        loginbutton.click()

        wait = 0
        while loginbutton.is_displayed() and wait < 30:
            time.sleep(1)
            wait += 1

        # add a patient
        self.driver.find_element_by_name("Settings").click()
        self.driver.find_element_by_name(" Add Patient ").click()  # TODO: Create an ID for Add Patient
        self.driver.find_element_by_name("First Name").send_keys("first name")
        self.driver.find_element_by_name("Last Name").send_keys("last name")
        self.driver.find_element_by_name("Female").click()
        self.driver.find_element_by_name("Date of Birth").click()
        self.driver.find_element_by_name("Confirm").click()
        submit = self.driver.find_element_by_name("Submit")
        submit.click()

        wait = 0
        while submit.is_displayed() and wait < 30:
            time.sleep(1)
            wait += 1

        self.driver.find_element_by_name(" Assign a Doctor ").click()  # TODO: Create an ID for assign a doctor
        # add a blank reference code
        # self.driver.find_element_by_name("Reference Code").send_keys("incorrectRefCode")
        submit = self.driver.find_element_by_name("Submit")
        submit.click()

        # assert that an error has not occured
        time.sleep(3)

        alert = self.driver.find_element_by_name("Alert")
        self.assertTrue(alert.is_displayed())

    # FRC07 - A list of tests that are "pending completion" can be viewed
    """
    Test Case: test_FRC07_viewTestsPendingCompletion_viewPictureTest
    Purpose: tests that carers can view the the tests assigned to their patients
    Expected Outcome: The picture test appears on the assigned tests page
    """
    def test_FRC07_viewTestsPendingCompletion_viewPictureTest(self):

        self.helper_add_doctorAndPatientWithPictureTest()

        # login
        self.driver.find_element_by_name("email").send_keys(['email@email.com'])
        self.driver.find_element_by_name("email").click()
        self.driver.find_element_by_name("password").send_keys(['password'])
        loginbutton = self.driver.find_element_by_name("Log In")
        loginbutton.click()

        wait = 0
        while loginbutton.is_displayed() and wait < 30:
            time.sleep(1)
            wait += 1

        # view assigned tests
        self.driver.find_element_by_name("Assigned Tests").click()

        # assert that the picture test is visible
        self.assertTrue(self.driver.find_element_by_name("Drawing test ").is_displayed())

    """
    Test Case: test_FRC07_viewTestsPendingCompletion_viewRecordingTest
    Purpose: tests that carers can view the the tests assigned to their patients
    Expected Outcome: The recording test appears on the assigned tests page
    """
    def test_FRC07_viewTestsPendingCompletion_viewRecordingTest(self):

        self.helper_add_doctorAndPatientWithRecordingTest()

        # login
        self.driver.find_element_by_name("email").send_keys(['email@email.com'])
        self.driver.find_element_by_name("email").click()
        self.driver.find_element_by_name("password").send_keys(['password'])
        loginbutton = self.driver.find_element_by_name("Log In")
        loginbutton.click()

        wait = 0
        while loginbutton.is_displayed() and wait < 30:
            time.sleep(1)
            wait += 1

        # view assigned tests
        self.driver.find_element_by_name("Assigned Tests").click()

        # assert that the picture test is visible
        self.assertTrue(self.driver.find_element_by_name("Recording test ").is_displayed())

    """
    Test Case: test_FRD07_viewTestsPendingCompletion_viewMultipleTests
    Purpose: tests that carers can view the the tests assigned to their patients
    Expected Outcome: The all tests appear on the assigned tests page
    """
    def test_FRC07_viewTestsPendingCompletion_viewMultipleTests(self):

        self.helper_add_doctorAndPatientWithMultipleAssignedTests()

        # login
        self.driver.find_element_by_name("email").send_keys(['email@email.com'])
        self.driver.find_element_by_name("email").click()
        self.driver.find_element_by_name("password").send_keys(['password'])
        loginbutton = self.driver.find_element_by_name("Log In")
        loginbutton.click()

        wait = 0
        while loginbutton.is_displayed() and wait < 30:
            time.sleep(1)
            wait += 1

        # view assigned tests
        self.driver.find_element_by_name("Assigned Tests").click()

        # assert that the picture test is visible
        self.assertTrue(self.driver.find_element_by_name("Drawing test ").is_displayed())
        self.assertTrue(self.driver.find_element_by_name("Recording test ").is_displayed())

    """
    Test Case: test_FRD07_viewTestsPendingCompletion_whereThereAreNoAssignedTests
    Purpose: tests that carers can view the the tests assigned to their patients
    Expected Outcome: The no tests appear on the assigned tests page
    """
    def test_FRC07_viewTestsPendingCompletion_whereThereAreNoAssignedTests(self):

        self.helper_add_user()
        self.helper_add_patient()

        # login
        self.driver.find_element_by_name("email").send_keys(['email@email.com'])
        self.driver.find_element_by_name("email").click()
        self.driver.find_element_by_name("password").send_keys(['password'])
        loginbutton = self.driver.find_element_by_name("Log In")
        loginbutton.click()

        wait = 0
        while loginbutton.is_displayed() and wait < 30:
            time.sleep(1)
            wait += 1

        # view assigned tests
        self.driver.find_element_by_name("Assigned Tests").click()

        time.sleep(10)

        self.assertTrue(self.driver.find_element_by_name("Complete the tests assigned to First"))

    # FRC08 - Complete tests via the app.
    # NOTE: Have tested that tests can be opened, but the performing of tests will be done in exploratory testing.
    """
    Test Case: test_FRC08A_testRecording
    Purpose: Test user voice recording and submission
    Expected Outcome: Should record successfully and submit the recording to the doctor
    """
    def test_FRC08A_testRecording(self):

        # add user
        self.helper_add_doctorAndPatientWithRecordingTest()

        # login
        self.driver.find_element_by_name("email").send_keys(['email@email.com'])
        self.driver.find_element_by_name("email").click()
        self.driver.find_element_by_name("password").send_keys(['password'])
        loginbutton = self.driver.find_element_by_name("Log In")
        loginbutton.click()

        wait = 0
        while loginbutton.is_displayed() and wait < 30:
            time.sleep(1)
            wait += 1

        self.driver.find_element_by_name("Assigned Tests").click()
        self.driver.find_element_by_name("Recording test ").click()

        # assert that you can see the recording test information
        self.assertTrue(self.driver.find_element_by_name("Press record and read the text aloud").is_displayed())

    def test_FRC08B_testDrawing(self):

        # add user
        self.helper_add_doctorAndPatientWithPictureTest()

        # login
        self.driver.find_element_by_name("email").send_keys(['email@email.com'])
        self.driver.find_element_by_name("email").click()
        self.driver.find_element_by_name("password").send_keys(['password'])
        loginbutton = self.driver.find_element_by_name("Log In")
        loginbutton.click()

        wait = 0
        while loginbutton.is_displayed() and wait < 30:
            time.sleep(1)
            wait += 1

        self.driver.find_element_by_name("Assigned Tests").click()
        self.driver.find_element_by_name("Drawing test ").click()

        # assert that you can see the recording test information
        self.assertTrue(self.driver.find_element_by_name("Draw a clock").is_displayed())

    # TODO implement FRC08C
    # def test_FRC08C_testQuestion(self):

    # FRC09 -- Test results can be uploaded and stored. Done in exploratory testing.

    """
    Test Case: test_FRC10_viewTestResults
    Purpose: tests that completed tests can be viewed
    Expected Outcome: drawing test result should appear on the completed tests page
    """
    def test_FRC10_viewTestResults(self):

        self.helper_add_doctorWithPictureTestResults()

        # login
        self.driver.find_element_by_name("email").send_keys(['email@email.com'])
        self.driver.find_element_by_name("email").click()
        self.driver.find_element_by_name("password").send_keys(['password'])
        loginbutton = self.driver.find_element_by_name("Log In")
        loginbutton.click()

        wait = 0
        while loginbutton.is_displayed() and wait < 30:
            time.sleep(1)
            wait += 1

        # view completed tests
        self.driver.find_element_by_name("Completed Tests").click()

        # assert that drawing test can be viewed
        self.assertTrue(self.driver.find_element_by_name("Drawing test (29/10/2017)").is_displayed())

    """
    Test Case: test_FRC10_viewTestResults_multipleTests
    Purpose: tests that completed tests can be viewed
    Expected Outcome: multiple drawings test result should appear on the completed tests page
    """
    def test_FRC10_viewTestResults_MultipleTests(self):

        self.helper_add_doctorWithMultiplePictureTestResults()

        # login
        self.driver.find_element_by_name("email").send_keys(['email@email.com'])
        self.driver.find_element_by_name("email").click()
        self.driver.find_element_by_name("password").send_keys(['password'])
        loginbutton = self.driver.find_element_by_name("Log In")
        loginbutton.click()

        wait = 0
        while loginbutton.is_displayed() and wait < 30:
            time.sleep(1)
            wait += 1

        # view completed tests
        self.driver.find_element_by_name("Completed Tests").click()

        # assert that drawing test can be viewed
        self.assertTrue(self.driver.find_element_by_name("Drawing test (29/10/2017)").is_displayed())
        self.assertTrue(self.driver.find_element_by_name("Drawing test 2 (29/10/2017)").is_displayed())

    """
    Test Case: test_FRC10_viewTestResults_noTestResults
    Purpose: tests that completed tests can be viewed
    Expected Outcome: no test results should appear on the completed tests page
    """
    def test_FRC10_viewTestResults_noTestResults(self):

        self.helper_add_user()
        self.helper_add_patient()

        # login
        self.driver.find_element_by_name("email").send_keys(['email@email.com'])
        self.driver.find_element_by_name("email").click()
        self.driver.find_element_by_name("password").send_keys(['password'])
        loginbutton = self.driver.find_element_by_name("Log In")
        loginbutton.click()

        wait = 0
        while loginbutton.is_displayed() and wait < 30:
            time.sleep(1)
            wait += 1

        # view completed tests
        self.driver.find_element_by_name("Completed Tests").click()

        # assert that no tests are on the screen
        self.assertTrue(self.driver.find_element_by_name("View recently completed tests").is_displayed())

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
        })

    def helper_add_secondPatient(self):
        self.db.patients.insert({
            "firstName": "Second",
            "lastName": "Patient",
            "gender": "Female",
            "dateOfBirth": "1980-12-30T16:00:00.000Z",
            "carers": [ObjectId(self.userId)],
        })

    def helper_add_doctorAndPatientWithPictureTest(self):

        carer = self.db.users.insert({
            "firstName": "firstName",
            "lastName": "lastName",
            "email": "email@email.com",
            "password": "$2a$10$9Xy0cMwnn0.y/bn/SWoAGOzSGPJuzoTgsJzcHMAYsO2A3U3BLg0Iy",
            "tests": [],
            "patients": []
        })

        self.userId = carer

        patientId = self.db.patients.insert({
            "firstName": "First",
            "lastName": "Patient",
            "gender": "Female",
            "dateOfBirth": "1980-12-30T16:00:00.000Z",
            "carers": [ObjectId(self.userId)],
        })

        self.db.users.update({'_id': ObjectId(carer)},
                             {'$set': {'patients': [ObjectId(patientId)]}})

        result = self.db.users.insert({
            "firstName": "doctorFirstName",
            "lastName": "doctorLastName",
            "email": "doctor@email.com",
            "password": "$2a$10$9Xy0cMwnn0.y/bn/SWoAGOzSGPJuzoTgsJzcHMAYsO2A3U3BLg0Iy",
            "tests": [],
            "patients": [ObjectId(patientId)]
        })

        print(result)

        doctorresult = self.db.doctors.insert({
            "user": ObjectId(result),
            "referenceCode": "correctRefCode"
        })

        # update patient with doctor
        self.db.patients.update({'_id': ObjectId(patientId)},
                             {'$set': {'carers': [ObjectId(result), ObjectId(carer)]}})

        # add test
        test = self.db.tests.insert({
            "name": "Drawing test",
            "description": "",
            "dateCreated": "1980-12-30T16:00:00.000Z",
            "creator": [ObjectId(result)],
            "components": [{
                "content": "Ask the patient to draw a clock",
                "instruction": "Draw a clock",
                "type": "image"
            }]
        })

        # assign test to patient
        self.db.patients.update({'_id': ObjectId(patientId)},
                             {'$set': {'tests': [ObjectId(test)]}})

        # update doctor with test
        self.db.doctor.update({'_id': ObjectId(result)},
                             {'$set': {'tests': [ObjectId(test)]}})

    def helper_add_doctorAndPatientWithRecordingTest(self):

        carer = self.db.users.insert({
            "firstName": "firstName",
            "lastName": "lastName",
            "email": "email@email.com",
            "password": "$2a$10$9Xy0cMwnn0.y/bn/SWoAGOzSGPJuzoTgsJzcHMAYsO2A3U3BLg0Iy",
            "tests": [],
            "patients": []
        })

        self.userId = carer

        patientId = self.db.patients.insert({
            "firstName": "First",
            "lastName": "Patient",
            "gender": "Female",
            "dateOfBirth": "1980-12-30T16:00:00.000Z",
            "carers": [ObjectId(self.userId)],
        })

        self.db.users.update({'_id': ObjectId(carer)},
                             {'$set': {'patients': [ObjectId(patientId)]}})

        result = self.db.users.insert({
            "firstName": "doctorFirstName",
            "lastName": "doctorLastName",
            "email": "doctor@email.com",
            "password": "$2a$10$9Xy0cMwnn0.y/bn/SWoAGOzSGPJuzoTgsJzcHMAYsO2A3U3BLg0Iy",
            "tests": [],
            "patients": [ObjectId(patientId)]
        })

        print(result)

        doctorresult = self.db.doctors.insert({
            "user": ObjectId(result),
            "referenceCode": "correctRefCode"
        })

        # update patient with doctor
        self.db.patients.update({'_id': ObjectId(patientId)},
                             {'$set': {'carers': [ObjectId(result), ObjectId(carer)]}})

        # add test
        test = self.db.tests.insert({
            "name": "Recording test",
            "description": "",
            "dateCreated": "1980-12-30T16:00:00.000Z",
            "creator": [ObjectId(result)],
            "components": [{
                "content": "Ask the patient to read:\n\nThe design project is almost over.",
                "instruction": "Press record and read the text aloud",
                "type": "audio"
            }]
        })

        # assign test to patient
        self.db.patients.update({'_id': ObjectId(patientId)},
                             {'$set': {'tests': [ObjectId(test)]}})

        # update doctor with test
        self.db.doctor.update({'_id': ObjectId(result)},
                             {'$set': {'tests': [ObjectId(test)]}})

    def helper_add_doctorAndPatientWithMultipleAssignedTests(self):

        carer = self.db.users.insert({
            "firstName": "firstName",
            "lastName": "lastName",
            "email": "email@email.com",
            "password": "$2a$10$9Xy0cMwnn0.y/bn/SWoAGOzSGPJuzoTgsJzcHMAYsO2A3U3BLg0Iy",
            "tests": [],
            "patients": []
        })

        self.userId = carer

        patientId = self.db.patients.insert({
            "firstName": "First",
            "lastName": "Patient",
            "gender": "Female",
            "dateOfBirth": "1980-12-30T16:00:00.000Z",
            "carers": [ObjectId(self.userId)],
        })

        self.db.users.update({'_id': ObjectId(carer)},
                             {'$set': {'patients': [ObjectId(patientId)]}})

        result = self.db.users.insert({
            "firstName": "doctorFirstName",
            "lastName": "doctorLastName",
            "email": "doctor@email.com",
            "password": "$2a$10$9Xy0cMwnn0.y/bn/SWoAGOzSGPJuzoTgsJzcHMAYsO2A3U3BLg0Iy",
            "tests": [],
            "patients": [ObjectId(patientId)]
        })

        print(result)

        doctorresult = self.db.doctors.insert({
            "user": ObjectId(result),
            "referenceCode": "correctRefCode"
        })

        # update patient with doctor
        self.db.patients.update({'_id': ObjectId(patientId)},
                                {'$set': {'carers': [ObjectId(result), ObjectId(carer)]}})

        # add test
        test = self.db.tests.insert({
            "name": "Recording test",
            "description": "",
            "dateCreated": "1980-12-30T16:00:00.000Z",
            "creator": [ObjectId(result)],
            "components": [{
                "content": "Ask the patient to read:\n\nThe design project is almost over.",
                "instruction": "Press record and read the text aloud",
                "type": "audio"
            }]
        })

        # add test
        test2 = self.db.tests.insert({
            "name": "Drawing test",
            "description": "",
            "dateCreated": "1980-12-30T16:00:00.000Z",
            "creator": [ObjectId(result)],
            "components": [{
                "content": "Ask the patient to draw a clock",
                "instruction": "Draw a clock",
                "type": "image"
            }]
        })

        # assign test to patient
        self.db.patients.update({'_id': ObjectId(patientId)},
                                {'$set': {'tests': [ObjectId(test), ObjectId(test2)]}})

        # update doctor with test
        self.db.doctor.update({'_id': ObjectId(result)},
                              {'$set': {'tests': [ObjectId(test), ObjectId(test2)]}})

    def helper_add_doctorWithPictureTestResults(self):

        carer = self.db.users.insert({
            "firstName": "firstName",
            "lastName": "lastName",
            "email": "email@email.com",
            "password": "$2a$10$9Xy0cMwnn0.y/bn/SWoAGOzSGPJuzoTgsJzcHMAYsO2A3U3BLg0Iy",
            "tests": [],
            "patients": []
        })

        self.userId = carer

        patientId = self.db.patients.insert({
            "firstName": "First",
            "lastName": "Patient",
            "gender": "Female",
            "dateOfBirth": "1980-12-30T16:00:00.000Z",
            "carers": [ObjectId(self.userId)],
        })

        self.db.users.update({'_id': ObjectId(carer)},
                             {'$set': {'patients': [ObjectId(patientId)]}})

        result = self.db.users.insert({
            "firstName": "doctorFirstName",
            "lastName": "doctorLastName",
            "email": "doctor@email.com",
            "password": "$2a$10$9Xy0cMwnn0.y/bn/SWoAGOzSGPJuzoTgsJzcHMAYsO2A3U3BLg0Iy",
            "tests": [],
            "patients": [ObjectId(patientId)]
        })

        print(result)

        doctorresult = self.db.doctors.insert({
            "user": ObjectId(result),
            "referenceCode": "correctRefCode"
        })

        # update patient with doctor
        self.db.patients.update({'_id': ObjectId(patientId)},
                             {'$set': {'carers': [ObjectId(result), ObjectId(carer)]}})

        # add test
        test = self.db.tests.insert({
            "name": "Drawing test",
            "description": "",
            "dateCreated": "1980-12-30T16:00:00.000Z",
            "creator": [ObjectId(result)],
            "components": [{
                "content": "Ask the patient to draw a clock",
                "instruction": "Draw a clock",
                "type": "image"
            }]
        })

        # assign test to patient
        self.db.patients.update({'_id': ObjectId(patientId)},
                             {'$set': {'tests': [ObjectId(test)]}})

        # update doctor with test
        self.db.doctor.update({'_id': ObjectId(result)},
                             {'$set': {'tests': [ObjectId(test)]}})

        #add test results
        self.db.testresults.insert({
            "test": ObjectId(test),
            "creator": ObjectId(carer),
            "patient": ObjectId(patientId),
            "date": "2017-10-29T03:25:54.182Z",
            "componentResults": {
                    "type": "image",
                    "originalname": "test-id=59f549e251181d14597d7952_section=0.jpg",
                    "filename": "1509247554176test-id=59f549e251181d14597d7952_section=0.jpg"
                }
        })

    def helper_add_doctorWithMultiplePictureTestResults(self):
        carer = self.db.users.insert({
            "firstName": "firstName",
            "lastName": "lastName",
            "email": "email@email.com",
            "password": "$2a$10$9Xy0cMwnn0.y/bn/SWoAGOzSGPJuzoTgsJzcHMAYsO2A3U3BLg0Iy",
            "tests": [],
            "patients": []
        })

        self.userId = carer

        patientId = self.db.patients.insert({
            "firstName": "First",
            "lastName": "Patient",
            "gender": "Female",
            "dateOfBirth": "1980-12-30T16:00:00.000Z",
            "carers": [ObjectId(self.userId)],
        })

        self.db.users.update({'_id': ObjectId(carer)},
                             {'$set': {'patients': [ObjectId(patientId)]}})

        result = self.db.users.insert({
            "firstName": "doctorFirstName",
            "lastName": "doctorLastName",
            "email": "doctor@email.com",
            "password": "$2a$10$9Xy0cMwnn0.y/bn/SWoAGOzSGPJuzoTgsJzcHMAYsO2A3U3BLg0Iy",
            "tests": [],
            "patients": [ObjectId(patientId)]
        })

        print(result)

        doctorresult = self.db.doctors.insert({
            "user": ObjectId(result),
            "referenceCode": "correctRefCode"
        })

        # update patient with doctor
        self.db.patients.update({'_id': ObjectId(patientId)},
                             {'$set': {'carers': [ObjectId(result), ObjectId(carer)]}})

        # add test
        test = self.db.tests.insert({
            "name": "Drawing test",
            "description": "",
            "dateCreated": "1980-12-30T16:00:00.000Z",
            "creator": [ObjectId(result)],
            "components": [{
                "content": "Ask the patient to draw a clock",
                "instruction": "Draw a clock",
                "type": "image"
            }]
        })

        # assign test to patient
        self.db.patients.update({'_id': ObjectId(patientId)},
                             {'$set': {'tests': [ObjectId(test)]}})

        # update doctor with test
        self.db.doctor.update({'_id': ObjectId(result)},
                             {'$set': {'tests': [ObjectId(test)]}})

        #add test results
        self.db.testresults.insert({
            "test": ObjectId(test),
            "creator": ObjectId(carer),
            "patient": ObjectId(patientId),
            "date": "2017-10-29T03:25:54.182Z",
            "componentResults": {
                    "type": "image",
                    "originalname": "test-id=59f549e251181d14597d7952_section=0.jpg",
                    "filename": "1509247554176test-id=59f549e251181d14597d7952_section=0.jpg"
                }
        })

        # add test
        test2 = self.db.tests.insert({
            "name": "Drawing test 2",
            "description": "",
            "dateCreated": "1980-12-30T16:00:00.000Z",
            "creator": [ObjectId(result)],
            "components": [{
                "content": "Ask the patient to draw a clock",
                "instruction": "Draw a clock",
                "type": "image"
            }]
        })

        # assign test to patient
        self.db.patients.update({'_id': ObjectId(patientId)},
                                {'$set': {'tests': [ObjectId(test2)]}})

        # update doctor with test
        self.db.doctor.update({'_id': ObjectId(result)},
                              {'$set': {'tests': [ObjectId(test2)]}})

        # add test results
        self.db.testresults.insert({
            "test": ObjectId(test2),
            "creator": ObjectId(carer),
            "patient": ObjectId(patientId),
            "date": "2017-10-29T03:25:54.182Z",
            "componentResults": {
                "type": "image",
                "originalname": "test-id=59f549e251181d14597d7952_section=0.jpg",
                "filename": "1509247554176test-id=59f549e251181d14597d7952_section=0.jpg"
            }
        })

if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(MobileAppTestAppium)
    unittest.TextTestRunner(verbosity=2).run(suite)
