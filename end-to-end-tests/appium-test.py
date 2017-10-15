
import os
import unittest
import time
from appium import webdriver
from pymongo import MongoClient

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
        self.driver = webdriver.Remote('http://127.0.0.1:4723/wd/hub', desired_caps)

    #test login
    def test_login(self):

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

    def test_login_invalidemail(self):

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

    def test_login_invalidpassword(self):

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

    #test sign up
    def test_signup(self):
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
        confirmpassword.send_keys("password")

        createaccountbutton.click()

        time.sleep(3)

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

    def test_signup_incorrectconfirmpassword(self):
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

    def test_signup_missingfield(self):
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

    def test_signup_useralreadyexists(self):
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

    #test log out
    def test_logout(self):

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

    #test recording test
    def test_testrecording(self):

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

    def tearDown(self):
        self.driver.quit()

    def helper_add_user(self):
            result = self.db.users.insert_one({
                    "firstName": "firstName",
                    "lastName": "lastName",
                    "email": "email@email.com",
                    "password": "$2a$10$9Xy0cMwnn0.y/bn/SWoAGOzSGPJuzoTgsJzcHMAYsO2A3U3BLg0Iy",
                    "tests": [],
                    "patients": []
            });
            print(result)

if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(MobileAppTestAppium)
    unittest.TextTestRunner(verbosity=2).run(suite)