

The backend tests are written using the Mocha framework:
https://mochajs.org


Instructions to evaluate code coverage with Mocha

INSTALL
npm install -g mocha


RUN
istanbul cover _mocha -- -R spec



Current Code Coverage Summary

Connected to db undefined
        ✓ should give a 400 Status Code (6254ms)


  1 passing (6s)

=============================================================================
Writing coverage object [/Users/caitlinwoods/Desktop/early-dementia-diagnosis/backend-js/coverage/coverage.json]
Writing coverage reports at [/Users/caitlinwoods/Desktop/early-dementia-diagnosis/backend-js/coverage]
=============================================================================

=============================== Coverage summary ===============================
Statements   : 56.44% ( 184/326 )
Branches     : 7.14% ( 4/56 )
Functions    : 14.71% ( 10/68 )
Lines        : 56.44% ( 184/326 )
==============================================================================


Next steps: Complete tests, setup defect assigning strategy and maximise coverage.