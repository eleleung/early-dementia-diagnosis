
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
import unittest, time, re
from pymongo import MongoClient
from bson.objectid import ObjectId


class WebAppTest(unittest.TestCase):
    
    # packages: geckodriver v0.19.0, selenium version 3.6.0, firefox v 56

    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(30)
        self.base_url = "http://localhost:4200/"
        self.verificationErrors = []
        self.accept_next_alert = True

        #connect to mongoDB
        self.client = MongoClient("mongodb://test:test@ds013956.mlab.com:13956/alz_backend_test")
        self.db = self.client['alz_backend_test']
        result = self.db.doctors.delete_many({})
        result = self.db.users.delete_many({})
        result = self.db.patients.delete_many({})
        result = self.db.tests.delete_many({})
        result = self.db.testresults.delete_many({})
        print(result)

    # FRD02 - signup tests
    """
    Test Case: test_FRD02_validSignUp_shouldSignUpNewDoctor
    Purpose: test that a new doctor account can be created
    Expected Outcome: doctor should be signed up
    """
    def test_FRD02_validSignUp_shouldSignUpNewDoctor(self):
        driver = self.driver
        driver.get(self.base_url)

        for i in range(10):
            try:
                if driver.find_element_by_xpath("//div[@class='login']"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        driver.find_element_by_xpath("//button[@class='ui button']").click()
        driver.find_element_by_xpath("//input[@id='firstName']").send_keys('first')
        driver.find_element_by_xpath("//input[@id='lastName']").send_keys('last')
        driver.find_element_by_xpath("//input[@id='registerEmail']").send_keys('email@email.com')
        driver.find_element_by_xpath("//input[@id='registerPassword']").send_keys('password')
        driver.find_element_by_xpath("//input[@id='confirmPassword']").send_keys('password')
        driver.find_element_by_xpath("//button[contains(.,'Register')]").click();

        self.assertTrue(driver.find_element_by_xpath("//p[contains(.,'Successfully registered. Please login now')]"))

    """
    Test Case: test_FRD02_invalidSignUp_shouldSignUpNewDoctor
    Purpose: test that a new doctor account is not created when confirm passwords dont match
    Expected Outcome: doctor should not be signed up
    """
    def test_FRD02_invalidSignUp_incorrectConfirmPassword_shouldNotSignUpNewDoctor(self):
        driver = self.driver
        driver.get(self.base_url)

        for i in range(10):
            try:
                if driver.find_element_by_xpath("//div[@class='login']"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        driver.find_element_by_xpath("//button[@class='ui button']").click()
        driver.find_element_by_xpath("//input[@id='firstName']").send_keys('first')
        driver.find_element_by_xpath("//input[@id='lastName']").send_keys('last')
        driver.find_element_by_xpath("//input[@id='registerEmail']").send_keys('email@email.com')
        driver.find_element_by_xpath("//input[@id='registerPassword']").send_keys('password')
        driver.find_element_by_xpath("//input[@id='confirmPassword']").send_keys('invalid')
        driver.find_element_by_xpath("//button[contains(.,'Register')]").click();

        self.assertTrue(driver.find_element_by_xpath("//p[contains(.,'Make sure your passwords match!')]"))

    """
    Test Case: test_FRD02_invalidSignUp_duplicateUser_shouldSignUpNewDoctor
    Purpose: test that a new doctor account is not created when the user is a duplicate
    Expected Outcome: doctor should not be signed up
    """
    def test_FRD02_invalidSignUp_duplicateUser_shouldNotSignUpNewDoctor(self):

        self.helper_add_doctor()

        driver = self.driver
        driver.get(self.base_url)

        for i in range(10):
            try:
                if driver.find_element_by_xpath("//div[@class='login']"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        driver.find_element_by_xpath("//button[@class='ui button']").click()
        driver.find_element_by_xpath("//input[@id='firstName']").send_keys('first')
        driver.find_element_by_xpath("//input[@id='lastName']").send_keys('last')
        driver.find_element_by_xpath("//input[@id='registerEmail']").send_keys('doctor@email.com')
        driver.find_element_by_xpath("//input[@id='registerPassword']").send_keys('password')
        driver.find_element_by_xpath("//input[@id='confirmPassword']").send_keys('password')
        driver.find_element_by_xpath("//button[contains(.,'Register')]").click()

        driver.find_element_by_xpath("//p[contains(.,'Error with registration credentials, please try again')]")


    # FRD03 - login tests
    """
    Test Case: test_FRC03A_validLogin_shouldLoginCorrectly
    Purpose: test a valid doctor login on the doctor web app
    Expected Outcome: doctor should be logged in
    """
    def test_FRD03A_validLogin_shouldLoginCorrectly(self):

        self.helper_add_doctor()

        driver = self.driver
        driver.get(self.base_url)

        for i in range(10):
            try:
                if driver.find_element_by_xpath("//div[@class='login']") : break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        driver.find_element_by_id("email").clear()
        driver.find_element_by_id("email").send_keys("doctor@email.com")
        driver.find_element_by_id("password").clear()
        driver.find_element_by_id("password").send_keys("password")
        driver.find_element_by_xpath("//button[@type='submit']").click()
        # ERROR: Caught exception [Error: locator strategy either id or name must be specified explicitly.]

        # enter email
        self.assertEqual("doctor@email.com", driver.find_element_by_id("email").get_attribute("value"))
        for i in range(10):
            try:
                if "doctor@email.com" == driver.find_element_by_id("email").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        # enter password
        self.assertEqual("password", driver.find_element_by_id("password").get_attribute("value"))
        for i in range(60):
            try:
                if "password" == driver.find_element_by_id("password").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        # click submit
        driver.find_element_by_xpath("//button[@type='submit']").click()

        # assert that we have hit the overview page
        self.assertTrue(driver.find_element_by_xpath("//h1[contains(.,'Overview')]"))

    """
    Test Case: test_FRD03B_invalidLoginDoctorDoesNotExist_shouldError
    Purpose: test an invalid doctor login where account does not exist in the database
    Expected Outcome: doctor should not be logged in
    """
    def test_FRD03A_validLogin_shouldLoginCorrectly(self):

        self.helper_add_doctor()

        driver = self.driver
        driver.get(self.base_url)

        for i in range(10):
            try:
                if driver.find_element_by_xpath("//div[@class='login']") : break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        driver.find_element_by_id("email").clear()
        driver.find_element_by_id("email").send_keys("doctor@email.com")
        driver.find_element_by_id("password").clear()
        driver.find_element_by_id("password").send_keys("password")
        driver.find_element_by_xpath("//button[@type='submit']").click()
        # ERROR: Caught exception [Error: locator strategy either id or name must be specified explicitly.]

        # enter email
        self.assertEqual("doctor@email.com", driver.find_element_by_id("email").get_attribute("value"))
        for i in range(10):
            try:
                if "doctor@email.com" == driver.find_element_by_id("email").get_attribute("value") : break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        # enter password
        self.assertEqual("password", driver.find_element_by_id("password").get_attribute("value"))
        for i in range(60):
            try:
                if "password" == driver.find_element_by_id("password").get_attribute("value") : break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        # click submit
        driver.find_element_by_xpath("//button[@type='submit']").click()

        # assert that we have hit the overview page
        self.assertTrue(driver.find_element_by_xpath("//h1[contains(.,'Overview')]"))

    """
    Test Case: test_FRD03B_invalidLoginDoctorDoesNotExist_shouldError
    Purpose: test an invalid doctor login where account does not exist in the database
    Expected Outcome: doctor should not be logged in
    """
    def test_FRD03B_invalidLoginDoctorDoesNotExist_shouldError(self):
        driver = self.driver
        driver.get("http://localhost:4200")
        driver.find_element_by_id("email").clear()
        driver.find_element_by_id("email").send_keys("invlid@email")
        driver.find_element_by_id("password").clear()
        driver.find_element_by_id("password").send_keys("invalid")
        driver.find_element_by_xpath("//button[@type='submit']").click()
        for i in range(10):
            try:
                if driver.find_element_by_xpath(
                    "//p[contains(.,'Error with login credentials, please check your email and password')]"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")
        self.assertTrue(driver.find_element_by_xpath("//p[contains(.,'Error with login credentials, please check your email and password')]"))

    """
    Test Case: test_FRD03B_invalidLoginNoPasswordEntered_shouldError
    Purpose: test an invalid login where no password is entered
    Expected Outcome: doctor should not be logged in
    """
    def test_FRD03B_invalidLoginNoPasswordEntered_shouldError(self):

            self.helper_add_doctor()

            driver = self.driver
            driver.get(self.base_url)
            driver.find_element_by_id("email").clear()
            driver.find_element_by_id("email").send_keys("invalid@email")
            driver.find_element_by_xpath("//button[@type='submit']").click()
            for i in range(60):
                try:
                    if driver.find_element_by_xpath(
                        "//p[contains(.,'Error with login credentials, please check your email and password')]"): break
                except:
                    pass
                time.sleep(1)
            else:
                self.fail("time out")
            self.assertTrue(driver.find_element_by_xpath(
                    "//p[contains(.,'Error with login credentials, please check your email and password')]"))

    """
    Test Case: test_FRD03B_invalidLoginNoEmailEntered_shouldError
    Purpose: test an invalid login where no email is entered
    Expected Outcome: doctor should not be logged in
    """
    def test_FRD03B_invalidLoginNoEmailEntered_shouldError(self):

            self.helper_add_doctor()

            driver = self.driver
            driver.get(self.base_url)
            driver.find_element_by_id("email").clear()
            driver.find_element_by_id("password").clear()
            driver.find_element_by_id("password").send_keys("password")
            driver.find_element_by_xpath("//button[@type='submit']").click()
            for i in range(10):
                try:
                    if driver.find_element_by_xpath(
                        "//p[contains(.,'Error with login credentials, please check your email and password')]"): break
                except:
                    pass
                time.sleep(1)
            else:
                self.fail("time out")
            self.assertTrue(driver.find_element_by_xpath(
                    "//p[contains(.,'Error with login credentials, please check your email and password')]"))

    # FRD04 - a home page appears when first logged in
    """
    Test Case: test_FRD04_onSuccessfulLogin_HomepageIsVisibleWithStatistics
    Purpose: test that users can see homepage when first logged in
    Expected Outcome: a homepage should exist with some basic statistics about the state of the application
    """
    def test_FRD04_onSuccessfulLogin_HomepageIsVisibleWithStatistics(self):

        self.helper_add_doctor()

        driver = self.driver
        driver.get(self.base_url)

        for i in range(10):
            try:
                if driver.find_element_by_xpath("//div[@class='login']") : break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        driver.find_element_by_id("email").clear()
        driver.find_element_by_id("email").send_keys("doctor@email.com")
        driver.find_element_by_id("password").clear()
        driver.find_element_by_id("password").send_keys("password")
        driver.find_element_by_xpath("//button[@type='submit']").click()
        # ERROR: Caught exception [Error: locator strategy either id or name must be specified explicitly.]

        # enter email
        self.assertEqual("doctor@email.com", driver.find_element_by_id("email").get_attribute("value"))
        for i in range(10):
            try:
                if "doctor@email.com" == driver.find_element_by_id("email").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        # enter password
        self.assertEqual("password", driver.find_element_by_id("password").get_attribute("value"))
        for i in range(60):
            try:
                if "password" == driver.find_element_by_id("password").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        # click submit
        driver.find_element_by_xpath("//button[@type='submit']").click()

        # assert that we have hit the overview page
        # self.assertTrue(driver.find_element_by_xpath("//h1[contains(.,'Overview')]"));
        self.assetTrue(False)

    # FRD05 - new patients can be added to user account
    """
    Test Case: test_FRD05_viewDoctorReferenceCode_shouldDisplayReferenceCodeCorrectly
    Purpose: test that doctors can view their reference code so they can give it to carers
    Expected Outcome: the doctor's reference code should display correctly
    """
    def test_FRD05_viewDoctorReferenceCode_shouldDisplayReferenceCodeCorrectly(self):
        self.helper_add_doctor()

        driver = self.driver
        driver.get(self.base_url)

        for i in range(10):
            try:
                if driver.find_element_by_xpath("//div[@class='login']"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        driver.find_element_by_id("email").clear()
        driver.find_element_by_id("email").send_keys("doctor@email.com")
        driver.find_element_by_id("password").clear()
        driver.find_element_by_id("password").send_keys("password")
        driver.find_element_by_xpath("//button[@type='submit']").click()
        # ERROR: Caught exception [Error: locator strategy either id or name must be specified explicitly.]

        # enter email
        self.assertEqual("doctor@email.com", driver.find_element_by_id("email").get_attribute("value"))
        for i in range(10):
            try:
                if "doctor@email.com" == driver.find_element_by_id("email").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        # enter password
        self.assertEqual("password", driver.find_element_by_id("password").get_attribute("value"))
        for i in range(60):
            try:
                if "password" == driver.find_element_by_id("password").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        # click submit
        driver.find_element_by_xpath("//button[@type='submit']").click()

        # get reference code
        driver.find_element_by_xpath("//span[contains(.,'My Reference Code')]").click()

        # assert that the correct reference code is displayed
        self.assertTrue(driver.find_element_by_xpath("//b[contains(.,'correctRefCode')]"))

    # FRD06 - not delivered

    # FRD07 - A list of currently monitored patients can be viewed
    """
    Test Case: test_FRD07_viewDoctorPatientList
    Purpose: tests that a list of the doctor's patients can be viewed
    Expected Outcome: doctor should be able to view their patients on this page
    """
    def test_FRD07_viewDoctorPatientList_shouldShowMinitoredPatients(self):

        self.addDoctorWithPatient()

        driver = self.driver
        driver.get(self.base_url)

        for i in range(10):
            try:
                if driver.find_element_by_xpath("//div[@class='login']"):break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        driver.find_element_by_id("email").clear()
        driver.find_element_by_id("email").send_keys("doctor@email.com")
        driver.find_element_by_id("password").clear()
        driver.find_element_by_id("password").send_keys("password")
        driver.find_element_by_xpath("//button[@type='submit']").click()
        # ERROR: Caught exception [Error: locator strategy either id or name must be specified explicitly.]

        #enter email
        self.assertEqual("doctor@email.com", driver.find_element_by_id("email").get_attribute("value"))
        for i in range(10):
            try:
                if "doctor@email.com" == driver.find_element_by_id("email").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        #enter password
        self.assertEqual("password", driver.find_element_by_id("password").get_attribute("value"))
        for i in range(60):
            try:
                if "password" == driver.find_element_by_id("password").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        #click submit
        driver.find_element_by_xpath("//button[@type='submit']").click()

        time.sleep(2)

        driver.find_element_by_xpath("//span[contains(.,'Patients')]").click()

        #assert that first patient is visible
        self.assertTrue(driver.find_element_by_xpath("//td[contains(.,'First')]"))
        self.assertTrue(driver.find_element_by_xpath("//td[contains(.,'Patient')]"))
        self.assertTrue(driver.find_element_by_xpath("//td[contains(.,'Female')]"))

    """
    Test Case: test_FRD07_viewDoctorPatientList_shouldShowNoPatientsWhenThereAreNoPatients
    Purpose: tests that no patients are shown when there are no assigned patients
    Expected Outcome: doctor should be propmpted that there are no patients to be displayed
    """
    def test_FRD07_viewDoctorPatientList_shouldShowNoPatientsWhenThereAreNoPatients(self):

        self.helper_add_doctor()

        driver = self.driver
        driver.get(self.base_url)

        for i in range(10):
            try:
                if driver.find_element_by_xpath("//div[@class='login']"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        driver.find_element_by_id("email").clear()
        driver.find_element_by_id("email").send_keys("doctor@email.com")
        driver.find_element_by_id("password").clear()
        driver.find_element_by_id("password").send_keys("password")
        driver.find_element_by_xpath("//button[@type='submit']").click()
        # ERROR: Caught exception [Error: locator strategy either id or name must be specified explicitly.]

        # enter email
        self.assertEqual("doctor@email.com", driver.find_element_by_id("email").get_attribute("value"))
        for i in range(10):
            try:
                if "doctor@email.com" == driver.find_element_by_id("email").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        # enter password
        self.assertEqual("password", driver.find_element_by_id("password").get_attribute("value"))
        for i in range(60):
            try:
                if "password" == driver.find_element_by_id("password").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        # click submit
        driver.find_element_by_xpath("//button[@type='submit']").click()

        time.sleep(2)

        driver.find_element_by_xpath("//span[contains(.,'Patients')]").click()

        # assert that no pateints are visible
        driver.find_element_by_xpath("//td[contains(.,'There are no patients at the moment')]")

    """
    Test Case: test_FRD07_viewDoctorPatientList
    Purpose: tests that a list of the doctor's patients can be viewed
    Expected Outcome: doctor should be able to view their patients on this page
    """
    def test_FRD07_viewPatientDetails_shouldShowCorrectDetails(self):
        self.addDoctorWithPatient()

        driver = self.driver
        driver.get(self.base_url)

        for i in range(10):
            try:
                if driver.find_element_by_xpath("//div[@class='login']"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        driver.find_element_by_id("email").clear()
        driver.find_element_by_id("email").send_keys("doctor@email.com")
        driver.find_element_by_id("password").clear()
        driver.find_element_by_id("password").send_keys("password")
        driver.find_element_by_xpath("//button[@type='submit']").click()
        # ERROR: Caught exception [Error: locator strategy either id or name must be specified explicitly.]

        # enter email
        self.assertEqual("doctor@email.com", driver.find_element_by_id("email").get_attribute("value"))
        for i in range(10):
            try:
                if "doctor@email.com" == driver.find_element_by_id("email").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        # enter password
        self.assertEqual("password", driver.find_element_by_id("password").get_attribute("value"))
        for i in range(60):
            try:
                if "password" == driver.find_element_by_id("password").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        # click submit
        driver.find_element_by_xpath("//button[@type='submit']").click()

        time.sleep(2)

        driver.find_element_by_xpath("//span[contains(.,'Patients')]").click()

        # click on first patient
        driver.find_element_by_xpath("//td[contains(.,'First')]").click()
        #click view button
        driver.find_element_by_xpath("//button[contains(.,'View')]").click()
        #click patient details table
        driver.find_element_by_xpath("//a[contains(.,'Patient Details')]").click()

        #assert that patient details are displayed
        self.assertTrue(driver.find_element_by_xpath("//div[contains(.,'First Name')]"))

    # FRD08 - test construct tests
    '''
    Test Case: test_FRD08A_addTestWithRecordSpeechComponent_shouldCreateTestSuccessfully
    Purpose: tests that a doctor can add a test that includes a record speech component
    Expected Outcome: test should be added successfully
    '''
    def test_FRD08A_addTestWithRecordSpeechComponent_shouldCreateTestSuccessfully(self):

        self.helper_add_doctor()

        driver = self.driver
        driver.get(self.base_url)

        for i in range(10):
            try:
                if driver.find_element_by_xpath("//div[@class='login']"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        driver.find_element_by_id("email").clear()
        driver.find_element_by_id("email").send_keys("doctor@email.com")
        driver.find_element_by_id("password").clear()
        driver.find_element_by_id("password").send_keys("password")
        driver.find_element_by_xpath("//button[@type='submit']").click()
        # ERROR: Caught exception [Error: locator strategy either id or name must be specified explicitly.]

        # enter email
        self.assertEqual("doctor@email.com", driver.find_element_by_id("email").get_attribute("value"))
        for i in range(10):
            try:
                if "doctor@email.com" == driver.find_element_by_id("email").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        # enter password
        self.assertEqual("password", driver.find_element_by_id("password").get_attribute("value"))
        for i in range(60):
            try:
                if "password" == driver.find_element_by_id("password").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        # click submit
        driver.find_element_by_xpath("//button[@type='submit']").click()
        time.sleep(2)
        driver.find_element_by_xpath("//span[contains(.,'Create Tests')]").click()
        driver.find_element_by_xpath("//button[@ng-reflect-content='Create a new test']").click()
        driver.find_element_by_xpath("//button[@ng-reflect-content='Add a speech component to your']").click()
        driver.find_element_by_xpath("//input[@id='testName']").send_keys("Speech test")
        driver.find_element_by_xpath("//input[@name='instruction']").send_keys("Aduo recording")
        driver.find_element_by_xpath("//textarea[@id='content']").send_keys("Ask the patient to say hello")
        driver.find_element_by_xpath("//button[contains(.,'Save Test')]").click()

        #assert
        self.assertTrue(driver.find_element_by_xpath("//div[contains(.,'Test successfully created!')]"))

    '''
    Test Case: test_FRD08A_addTestWithDrawingomponent_shouldCreateTestSuccessfully
    Purpose: tests that a doctor can add a test that includes a drawing component
    Expected Outcome: test should be added successfully
    '''
    def test_FRD08B_addTestWithDrawingComponent_shouldCreateTestSuccessfully(self):

        self.helper_add_doctor()

        driver = self.driver
        driver.get(self.base_url)

        for i in range(10):
            try:
                if driver.find_element_by_xpath("//div[@class='login']"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        driver.find_element_by_id("email").clear()
        driver.find_element_by_id("email").send_keys("doctor@email.com")
        driver.find_element_by_id("password").clear()
        driver.find_element_by_id("password").send_keys("password")
        driver.find_element_by_xpath("//button[@type='submit']").click()
        # ERROR: Caught exception [Error: locator strategy either id or name must be specified explicitly.]

        # enter email
        self.assertEqual("doctor@email.com", driver.find_element_by_id("email").get_attribute("value"))
        for i in range(10):
            try:
                if "doctor@email.com" == driver.find_element_by_id("email").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        # enter password
        self.assertEqual("password", driver.find_element_by_id("password").get_attribute("value"))
        for i in range(60):
            try:
                if "password" == driver.find_element_by_id("password").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        # click submit
        driver.find_element_by_xpath("//button[@type='submit']").click()
        time.sleep(2)
        driver.find_element_by_xpath("//span[contains(.,'Create Tests')]").click()
        driver.find_element_by_xpath("//button[@ng-reflect-content='Create a new test']").click()
        driver.find_element_by_xpath("//button[@ng-reflect-content='Add a drawable component to yo']").click()
        driver.find_element_by_xpath("//input[@id='testName']").send_keys("Drawing test")
        driver.find_element_by_xpath("//input[@name='instruction']").send_keys("Draw a clock")
        driver.find_element_by_xpath("//textarea[@id='content']").send_keys("Ask the patient to draw a clock")
        driver.find_element_by_xpath("//button[contains(.,'Save Test')]").click()

        #assert
        self.assertTrue(driver.find_element_by_xpath("//div[contains(.,'Test successfully created!')]"))

    '''
    Test Case: test_FRD08A_addTestWithQuestionComponent_shouldCreateTestSuccessfully
    Purpose: tests that a doctor can add a test that includes a question component
    Expected Outcome: test should be added successfully
    '''
    def test_FRD08C_addTestWithQuestionComponent_shouldCreateTestSucessfully(self):

        self.helper_add_doctor()

        driver = self.driver
        driver.get(self.base_url)

        for i in range(10):
            try:
                if driver.find_element_by_xpath("//div[@class='login']"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        driver.find_element_by_id("email").clear()
        driver.find_element_by_id("email").send_keys("doctor@email.com")
        driver.find_element_by_id("password").clear()
        driver.find_element_by_id("password").send_keys("password")
        driver.find_element_by_xpath("//button[@type='submit']").click()
        # ERROR: Caught exception [Error: locator strategy either id or name must be specified explicitly.]

        # enter email
        self.assertEqual("doctor@email.com", driver.find_element_by_id("email").get_attribute("value"))
        for i in range(10):
            try:
                if "doctor@email.com" == driver.find_element_by_id("email").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        # enter password
        self.assertEqual("password", driver.find_element_by_id("password").get_attribute("value"))
        for i in range(60):
            try:
                if "password" == driver.find_element_by_id("password").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        # click submit
        driver.find_element_by_xpath("//button[@type='submit']").click()
        time.sleep(2)
        driver.find_element_by_xpath("//span[contains(.,'Create Tests')]").click()
        driver.find_element_by_xpath("//button[@ng-reflect-content='Create a new test']").click()
        driver.find_element_by_xpath("//button[@ng-reflect-content='Add a question to your test.']").click()
        driver.find_element_by_xpath("//input[@id='testName']").send_keys("Question test")
        driver.find_element_by_xpath("//input[@name='instruction']").send_keys("What is the date today?")
        driver.find_element_by_xpath("//textarea[@id='content']").send_keys("Ask the patient what the date is today")
        driver.find_element_by_xpath("//button[contains(.,'Save Test')]").click()

        #assert
        self.assertTrue(driver.find_element_by_xpath("//div[contains(.,'Test successfully created!')]"))

    '''
    Test Case: test_FRD08A_addTestWithNoContentInComponent_shouldFailToCreateTest
    Purpose: tests that tests with no content cannot be created
    Expected Outcome: should fail to create the test
    '''
    def test_FRD08_addTestWithNoContentInComponent_shouldFailToCreateTest(self):
        self.helper_add_doctor()

        driver = self.driver
        driver.get(self.base_url)

        for i in range(10):
            try:
                if driver.find_element_by_xpath("//div[@class='login']"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        driver.find_element_by_id("email").clear()
        driver.find_element_by_id("email").send_keys("doctor@email.com")
        driver.find_element_by_id("password").clear()
        driver.find_element_by_id("password").send_keys("password")
        driver.find_element_by_xpath("//button[@type='submit']").click()
        # ERROR: Caught exception [Error: locator strategy either id or name must be specified explicitly.]

        # enter email
        self.assertEqual("doctor@email.com", driver.find_element_by_id("email").get_attribute("value"))
        for i in range(10):
            try:
                if "doctor@email.com" == driver.find_element_by_id("email").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        # enter password
        self.assertEqual("password", driver.find_element_by_id("password").get_attribute("value"))
        for i in range(60):
            try:
                if "password" == driver.find_element_by_id("password").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        # click submit
        driver.find_element_by_xpath("//button[@type='submit']").click()
        time.sleep(2)
        driver.find_element_by_xpath("//span[contains(.,'Create Tests')]").click()
        driver.find_element_by_xpath("//button[@ng-reflect-content='Create a new test']").click()
        driver.find_element_by_xpath("//button[@ng-reflect-content='Add a drawable component to yo']").click()
        driver.find_element_by_xpath("//input[@id='testName']").send_keys("Drawing test")
        driver.find_element_by_xpath("//input[@name='instruction']").send_keys("Draw a clock")
        #driver.find_element_by_xpath("//textarea[@id='content']").send_keys("Ask the patient to draw a clock")
        driver.find_element_by_xpath("//button[contains(.,'Save Test')]").click()

        time.sleep(2)

        # assert that alert has occured
        self.assertTrue(self.driver.switch_to.alert)


    '''
    Test Case: test_FRD08A_addTestWithNoInstructionInComponent_shouldFailToCreateTest
    Purpose: tests that tests with no instruction cannot be created
    Expected Outcome: should fail to create the test
    '''
    def test_FRD08_addTestWithNoInstructionInComponent_shouldFailToCreateTest(self):
        self.helper_add_doctor()

        driver = self.driver
        driver.get(self.base_url)

        for i in range(10):
            try:
                if driver.find_element_by_xpath("//div[@class='login']"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        driver.find_element_by_id("email").clear()
        driver.find_element_by_id("email").send_keys("doctor@email.com")
        driver.find_element_by_id("password").clear()
        driver.find_element_by_id("password").send_keys("password")
        driver.find_element_by_xpath("//button[@type='submit']").click()
        # ERROR: Caught exception [Error: locator strategy either id or name must be specified explicitly.]

        # enter email
        self.assertEqual("doctor@email.com", driver.find_element_by_id("email").get_attribute("value"))
        for i in range(10):
            try:
                if "doctor@email.com" == driver.find_element_by_id("email").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        # enter password
        self.assertEqual("password", driver.find_element_by_id("password").get_attribute("value"))
        for i in range(60):
            try:
                if "password" == driver.find_element_by_id("password").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        # click submit
        driver.find_element_by_xpath("//button[@type='submit']").click()
        time.sleep(2)
        driver.find_element_by_xpath("//span[contains(.,'Create Tests')]").click()
        driver.find_element_by_xpath("//button[@ng-reflect-content='Create a new test']").click()
        driver.find_element_by_xpath("//button[@ng-reflect-content='Add a drawable component to yo']").click()
        driver.find_element_by_xpath("//input[@id='testName']").send_keys("Drawing test")
        #driver.find_element_by_xpath("//input[@name='instruction']").send_keys("Draw a clock")
        driver.find_element_by_xpath("//textarea[@id='content']").send_keys("Ask the patient to draw a clock")
        driver.find_element_by_xpath("//button[contains(.,'Save Test')]").click()

        time.sleep(2)

        # assert that alert has occured
        self.assertTrue(self.driver.switch_to.alert)

    '''
    Test Case: test_FRD08_addTestWithNoTestName_shouldFailToCreateTest
    Purpose: tests that tests with no test name cannot be created
    Expected Outcome: should fail to create the test
    '''
    def test_FRD08_addTestWithNoTestName_shouldFailToCreateTest(self):
        self.helper_add_doctor()

        driver = self.driver
        driver.get(self.base_url)

        for i in range(10):
            try:
                if driver.find_element_by_xpath("//div[@class='login']"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        driver.find_element_by_id("email").clear()
        driver.find_element_by_id("email").send_keys("doctor@email.com")
        driver.find_element_by_id("password").clear()
        driver.find_element_by_id("password").send_keys("password")
        driver.find_element_by_xpath("//button[@type='submit']").click()
        # ERROR: Caught exception [Error: locator strategy either id or name must be specified explicitly.]

        # enter email
        self.assertEqual("doctor@email.com", driver.find_element_by_id("email").get_attribute("value"))
        for i in range(10):
            try:
                if "doctor@email.com" == driver.find_element_by_id("email").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        # enter password
        self.assertEqual("password", driver.find_element_by_id("password").get_attribute("value"))
        for i in range(60):
            try:
                if "password" == driver.find_element_by_id("password").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        # click submit
        driver.find_element_by_xpath("//button[@type='submit']").click()
        time.sleep(2)
        driver.find_element_by_xpath("//span[contains(.,'Create Tests')]").click()
        driver.find_element_by_xpath("//button[@ng-reflect-content='Create a new test']").click()
        driver.find_element_by_xpath("//button[@ng-reflect-content='Add a drawable component to yo']").click()
        #driver.find_element_by_xpath("//input[@id='testName']").send_keys("Drawing test")
        driver.find_element_by_xpath("//input[@name='instruction']").send_keys("Draw a clock")
        driver.find_element_by_xpath("//textarea[@id='content']").send_keys("Ask the patient to draw a clock")
        driver.find_element_by_xpath("//button[contains(.,'Save Test')]").click()

        # assert
        self.assertTrue(driver.find_element_by_xpath("//div[contains(.,'There was an error with saving your test. Try again later.')]"))

    # FRD09 - A list of previously built tests can be viewed
    '''
    Test Case: test_FRD09_viewCreatedTests_shouldShowCorrectDetails
    Purpose: tests that tests that have been created can be viewed
    Expected Outcome: should show correct details when viewing test
    '''
    def test_FRD09_viewCreatedTests_shouldShowCorrectDetails(self):

        self.helper_add_doctor()

        driver = self.driver
        driver.get(self.base_url)

        for i in range(10):
            try:
                if driver.find_element_by_xpath("//div[@class='login']"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        driver.find_element_by_id("email").clear()
        driver.find_element_by_id("email").send_keys("doctor@email.com")
        driver.find_element_by_id("password").clear()
        driver.find_element_by_id("password").send_keys("password")
        driver.find_element_by_xpath("//button[@type='submit']").click()
        # ERROR: Caught exception [Error: locator strategy either id or name must be specified explicitly.]

        # enter email
        self.assertEqual("doctor@email.com", driver.find_element_by_id("email").get_attribute("value"))
        for i in range(10):
            try:
                if "doctor@email.com" == driver.find_element_by_id("email").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        # enter password
        self.assertEqual("password", driver.find_element_by_id("password").get_attribute("value"))
        for i in range(60):
            try:
                if "password" == driver.find_element_by_id("password").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        # click submit
        driver.find_element_by_xpath("//button[@type='submit']").click()
        time.sleep(2)
        driver.find_element_by_xpath("//span[contains(.,'Create Tests')]").click()
        driver.find_element_by_xpath("//button[@ng-reflect-content='Create a new test']").click()
        driver.find_element_by_xpath("//button[@ng-reflect-content='Add a speech component to your']").click()
        driver.find_element_by_xpath("//input[@id='testName']").send_keys("Speech test")
        driver.find_element_by_xpath("//input[@name='instruction']").send_keys("Aduo recording")
        driver.find_element_by_xpath("//textarea[@id='content']").send_keys("Ask the patient to say hello")
        driver.find_element_by_xpath("//button[contains(.,'Save Test')]").click()

        # wait for tesrt to be successfully created
        driver.find_element_by_xpath("//div[contains(.,'Test successfully created!')]")

        # go back to the tests tab
        driver.find_element_by_xpath("//span[contains(.,'Create Tests')]").click()

        # assert that the test ecists on the test page and is assigned to 0 patients
        self.assertTrue(driver.find_element_by_xpath("//td[contains(.,'Speech test')]"))
        self.assertTrue(driver.find_element_by_xpath("//td[contains(.,'0')]"))

    '''
    Test Case: test_FRD09_viewCreatedTestsWhenTestCreationNotSuccessful_shouldNotShowAnyTests
    Purpose: tests that tests cannot be viewed when their creation was unsuccessful
    Expected Outcome: No tests should be displayed
    '''
    def test_FRD09_viewCreatedTestsWhenTestCreationNotSuccessful_shouldNotShowAnyTests(self):

        self.helper_add_doctor()

        driver = self.driver
        driver.get(self.base_url)

        for i in range(10):
            try:
                if driver.find_element_by_xpath("//div[@class='login']"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        driver.find_element_by_id("email").clear()
        driver.find_element_by_id("email").send_keys("doctor@email.com")
        driver.find_element_by_id("password").clear()
        driver.find_element_by_id("password").send_keys("password")
        driver.find_element_by_xpath("//button[@type='submit']").click()
        # ERROR: Caught exception [Error: locator strategy either id or name must be specified explicitly.]

        # enter email
        self.assertEqual("doctor@email.com", driver.find_element_by_id("email").get_attribute("value"))
        for i in range(10):
            try:
                if "doctor@email.com" == driver.find_element_by_id("email").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        # enter password
        self.assertEqual("password", driver.find_element_by_id("password").get_attribute("value"))
        for i in range(60):
            try:
                if "password" == driver.find_element_by_id("password").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        # click submit
        driver.find_element_by_xpath("//button[@type='submit']").click()
        time.sleep(2)
        driver.find_element_by_xpath("//span[contains(.,'Create Tests')]").click()
        driver.find_element_by_xpath("//button[@ng-reflect-content='Create a new test']").click()
        driver.find_element_by_xpath("//button[@ng-reflect-content='Add a speech component to your']").click()
        #driver.find_element_by_xpath("//input[@id='testName']").send_keys("Speech test")
        driver.find_element_by_xpath("//input[@name='instruction']").send_keys("Aduo recording")
        driver.find_element_by_xpath("//textarea[@id='content']").send_keys("Ask the patient to say hello")
        driver.find_element_by_xpath("//button[contains(.,'Save Test')]").click()

        # wait for test to not be successfully created
        driver.find_element_by_xpath(
            "//div[contains(.,'There was an error with saving your test. Try again later.')]")

        # go back to the tests tab
        driver.find_element_by_xpath("//span[contains(.,'Create Tests')]").click()

        # assert that the test does not exists on the screen
        self.assertTrue(driver.find_element_by_xpath("//td[contains(.,'There are no tests at the moment')]"))

    # FRD10 - Not delivered

    # FRD11 - Tests can be prescribed to patients for regular completion
    '''
    Test Case: test_FRD11_assignTestToPatient_shouldSuccessfullyAssign
    Purpose: tests that tests can be assigned to patients
    Expected Outcome: Test should be assigned to patient successfully
    '''
    def test_FRD11_assignTestToPatient_shouldSuccessfullyAssign(self):

        self.addDoctorWithPatient()

        driver = self.driver
        driver.get(self.base_url)

        for i in range(10):
            try:
                if driver.find_element_by_xpath("//div[@class='login']"):break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        driver.find_element_by_id("email").clear()
        driver.find_element_by_id("email").send_keys("doctor@email.com")
        driver.find_element_by_id("password").clear()
        driver.find_element_by_id("password").send_keys("password")
        driver.find_element_by_xpath("//button[@type='submit']").click()
        # ERROR: Caught exception [Error: locator strategy either id or name must be specified explicitly.]

        #enter email
        self.assertEqual("doctor@email.com", driver.find_element_by_id("email").get_attribute("value"))
        for i in range(10):
            try:
                if "doctor@email.com" == driver.find_element_by_id("email").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        #enter password
        self.assertEqual("password", driver.find_element_by_id("password").get_attribute("value"))
        for i in range(60):
            try:
                if "password" == driver.find_element_by_id("password").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        #click submit
        driver.find_element_by_xpath("//button[@type='submit']").click()

        #create a test
        driver.find_element_by_xpath("//span[contains(.,'Create Tests')]").click()
        driver.find_element_by_xpath("//button[@ng-reflect-content='Create a new test']").click()
        driver.find_element_by_xpath("//button[@ng-reflect-content='Add a question to your test.']").click()
        driver.find_element_by_xpath("//input[@id='testName']").send_keys("Question test")
        driver.find_element_by_xpath("//input[@name='instruction']").send_keys("What is the date today?")
        driver.find_element_by_xpath("//textarea[@id='content']").send_keys("Ask the patient what the date is today")
        driver.find_element_by_xpath("//button[contains(.,'Save Test')]").click()
        driver.find_element_by_xpath("//div[contains(.,'Test successfully created!')]")

        # go to patient tab, view patient and go to assigned tests tab
        driver.find_element_by_xpath("//span[contains(.,'Patients')]").click()
        driver.find_element_by_xpath("//td[contains(.,'First')]").click()
        driver.find_element_by_xpath("//button[contains(.,'View')]").click()
        driver.find_element_by_xpath("//a[contains(.,'Assigned Tests')]").click()
        driver.find_element_by_xpath("//button[@id='assignPatientTest']").click()

        # assert that test exists to be added
        self.assertTrue(driver.find_element_by_xpath("//td[contains(.,'Question test')]"))

        # click + to add test
        driver.find_element_by_xpath("//button[@class='ui icon button']").click()

        # assert that the test has been successfully assigned
        self.assertTrue(driver.find_element_by_xpath("//h1[contains(.,'First Patient')]"))
        self.driver.find_element_by_xpath("//td[contains(.,'Question test')]")

    # FRD12 - Tests completed by individual patients can be viewed
    '''
    Test Case: test_FRD12_viewCompletedDrawingTest_shouldBeAbleToSeeTestResults
    Purpose: tests that results of tests can be viewed
    Expected Outcome: completed drawing results can be viewed
    '''
    def test_FRD12_viewCompletedDrawingTest_shouldBeAbleToSeeTestResults(self):

        self.helper_add_doctorWithPictureTestResults()

        driver = self.driver
        driver.get(self.base_url)

        for i in range(10):
            try:
                if driver.find_element_by_xpath("//div[@class='login']"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        driver.find_element_by_id("email").clear()
        driver.find_element_by_id("email").send_keys("doctor@email.com")
        driver.find_element_by_id("password").clear()
        driver.find_element_by_id("password").send_keys("password")
        driver.find_element_by_xpath("//button[@type='submit']").click()
        # ERROR: Caught exception [Error: locator strategy either id or name must be specified explicitly.]

        # enter email
        self.assertEqual("doctor@email.com", driver.find_element_by_id("email").get_attribute("value"))
        for i in range(10):
            try:
                if "doctor@email.com" == driver.find_element_by_id("email").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        # enter password
        self.assertEqual("password", driver.find_element_by_id("password").get_attribute("value"))
        for i in range(60):
            try:
                if "password" == driver.find_element_by_id("password").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        # click submit
        driver.find_element_by_xpath("//button[@type='submit']").click()

        # go to patient tab, view patient and go to assigned tests tab
        driver.find_element_by_xpath("//span[contains(.,'Patients')]").click()
        driver.find_element_by_xpath("//td[contains(.,'First')]").click()
        driver.find_element_by_xpath("//button[contains(.,'View')]").click()

        # assert that the drawing test results exist in completed tests
        self.assertTrue(driver.find_element_by_xpath("//td[contains(.,'Drawing test')]"))

        # open up test details
        driver.find_element_by_xpath("//button[contains(@class,'ui icon button secondary')]").click()

        # assert that the test details can be seen
        self.assertTrue(driver.find_element_by_xpath("//td[contains(.,'Draw a clock Ask the patient to draw a clock')]"))

        # assert that the test result can be seen
        driver.find_element_by_xpath("//img[contains(@style,'width:100px; height:200px;')]")

    # NOTE: cannot test voice test in automated test suite, this will be done in exploratory testing

    '''
    Test Case: test_FRD11_viewCompletedTestsWhenNoneExist_shouldNotBeAbleToSeeTestResults
    Purpose: tests that no test results can be viewed when none exist
    Expected Outcome: should shoe no test results
    '''
    def test_FRD11_viewCompletedTestsWhenNoneExist_shouldNotBeAbleToSeeTestResults(self):

        self.addDoctorWithPatient()

        driver = self.driver
        driver.get(self.base_url)

        for i in range(10):
            try:
                if driver.find_element_by_xpath("//div[@class='login']"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        driver.find_element_by_id("email").clear()
        driver.find_element_by_id("email").send_keys("doctor@email.com")
        driver.find_element_by_id("password").clear()
        driver.find_element_by_id("password").send_keys("password")
        driver.find_element_by_xpath("//button[@type='submit']").click()
        # ERROR: Caught exception [Error: locator strategy either id or name must be specified explicitly.]

        # enter email
        self.assertEqual("doctor@email.com", driver.find_element_by_id("email").get_attribute("value"))
        for i in range(10):
            try:
                if "doctor@email.com" == driver.find_element_by_id("email").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        # enter password
        self.assertEqual("password", driver.find_element_by_id("password").get_attribute("value"))
        for i in range(60):
            try:
                if "password" == driver.find_element_by_id("password").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        # click submit
        driver.find_element_by_xpath("//button[@type='submit']").click()

        # go to patient tab, view patient and go to assigned tests tab
        driver.find_element_by_xpath("//span[contains(.,'Patients')]").click()
        driver.find_element_by_xpath("//td[contains(.,'First')]").click()
        driver.find_element_by_xpath("//button[contains(.,'View')]").click()

        # assert that the drawing test results exist in completed tests
        self.assertTrue(driver.find_element_by_xpath(
                "//td[contains(.,'This patient has not completed any tests')]"))

    def is_element_present(self, how, what):
        try:
            self.driver.find_element(by=how, value=what)
        except NoSuchElementException as e:
            return False
        return True

    def is_alert_present(self):
        try:
            self.driver.switch_to_alert()
        except NoAlertPresentException as e:
            return False
        return True

    def close_alert_and_get_its_text(self):
        try:
            alert = self.driver.switch_to_alert()
            alert_text = alert.text
            if self.accept_next_alert:
                alert.accept()
            else:
                alert.dismiss()
            return alert_text
        finally:
            self.accept_next_alert = True

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

    def helper_add_doctorWithPictureTestResults(self):

        carer = self.db.users.insert({
            "firstName": "firstName",
            "lastName": "lastName",
            "email": "email@email.com",
            "password": "$2a$10$9Xy0cMwnn0.y/bn/SWoAGOzSGPJuzoTgsJzcHMAYsO2A3U3BLg0Iy",
            "tests": [],
            "patients": []
        });

        self.userId = carer

        patientId = self.db.patients.insert({
            "firstName": "First",
            "lastName": "Patient",
            "gender": "Female",
            "dateOfBirth": "1980-12-30T16:00:00.000Z",
            "carers": [ObjectId(self.userId)],
        })

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
                             {'$set': {'carers': [ObjectId(result)]}})

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

    def addDoctorWithPatient(self):

        carer = self.db.users.insert({
            "firstName": "firstName",
            "lastName": "lastName",
            "email": "email@email.com",
            "password": "$2a$10$9Xy0cMwnn0.y/bn/SWoAGOzSGPJuzoTgsJzcHMAYsO2A3U3BLg0Iy",
            "tests": [],
            "patients": []
        });

        self.userId = carer

        patientId = self.db.patients.insert({
            "firstName": "First",
            "lastName": "Patient",
            "gender": "Female",
            "dateOfBirth": "1980-12-30T16:00:00.000Z",
            "carers": [ObjectId(self.userId)],
        })

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
                             {'$set': {'carers': [ObjectId(result)]}})

    def addDoctorWithNoReferenceCode(self):
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
        })

    def tearDown(self):
        self.driver.quit()
        self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
    unittest.main()
