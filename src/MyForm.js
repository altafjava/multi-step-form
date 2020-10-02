import { Checkbox, FormControlLabel, Radio, RadioGroup, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    width: '80%',
    margin: 'auto',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  formContainer: {
    margin: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  formGroup: {
    marginBottom: '2rem',
  },
  resetContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  textField: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  textfieldWidth: {
    width: 500,
  },
}));

const MyForm = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [checked, setChecked] = React.useState(false);
  const [isSubmitting, setSubmitting] = React.useState(false);
  const [gender, setGender] = React.useState('M');

  const steps = ['Personal Details', 'Bank Details', 'Address'];
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const validationSchema = [
    Yup.object().shape({
      firstName: Yup.string().required('First Name is required'),
      lastName: Yup.string().required('Last Name is required'),
    }),
    Yup.object().shape({
      bankName: Yup.string().required('Bank Name is required'),
      balance: Yup.mixed().when('millionaire', {
        is: true,
        then: Yup.number().required().min(1_000_000, 'Because you said you are a millionaire you need to have 1 million'),
      }),
    }),
    Yup.object().shape({
      address: Yup.string().required('Address is required'),
    }),
  ];
  const currentValidationSchema = validationSchema[activeStep];
  function isLastStep() {
    return activeStep === steps.length - 1;
  }
  return (
    <div>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div className={classes.mainContainer}>
        <Formik
          validationSchema={currentValidationSchema}
          initialValues={{
            firstName: '',
            lastName: '',
            gender: 'M',
            millionaire: false,
            bankName: '',
            balance: 0,
            address: '',
            description: '',
          }}
          onSubmit={(values, actions) => {
            handleNext();
            actions.setTouched({});
            actions.setSubmitting(false);
            if (isLastStep()) {
              setSubmitting(true);
              const formData = document.getElementById('form__data');
              formData.innerText = JSON.stringify(values, null, 2);
              setSubmitting(false);
            }
          }}
        >
          {(props) => {
            const { values, touched, errors, handleChange, handleBlur, handleSubmit, handleReset, setFieldValue } = props;
            return (
              <form onSubmit={handleSubmit}>
                <div className={classes.formContainer}>
                  {activeStep === 0 && (
                    <div>
                      <div className={classes.formGroup}>
                        <TextField
                          id='firstName'
                          name='firstName'
                          label='First Name*'
                          value={values.firstName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          helperText={errors.firstName && touched.firstName && errors.firstName}
                          error={errors.firstName && touched.firstName}
                          className={classes.textfieldWidth}
                        />
                      </div>
                      <div className={classes.formGroup}>
                        <TextField
                          id='lastName'
                          name='lastName'
                          label='Last Name*'
                          value={values.lastName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          helperText={errors.lastName && touched.lastName && errors.lastName}
                          error={errors.lastName && touched.lastName}
                          className={classes.textfieldWidth}
                        />
                      </div>
                      <div className={classes.formGroup}>
                        <RadioGroup
                          aria-label='gender'
                          name='gender'
                          value={gender}
                          onChange={(e) => {
                            handleGenderChange(e);
                            setFieldValue(e.target.value);
                          }}
                          style={{ display: 'inline' }}
                        >
                          <FormControlLabel value='M' control={<Radio />} label='Male' />
                          <FormControlLabel value='F' control={<Radio />} label='Female' />
                        </RadioGroup>
                      </div>
                      <div className={classes.formGroup}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={checked}
                              onChange={() => {
                                setChecked(!checked);
                                setFieldValue('millionaire', !checked);
                              }}
                            />
                          }
                          label='I am a millionaire'
                        />
                      </div>
                    </div>
                  )}
                  {activeStep === 1 && (
                    <div>
                      <div className={classes.formGroup}>
                        <TextField
                          id='bankName'
                          name='bankName'
                          label='Bank Name*'
                          value={values.bankName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          helperText={errors.bankName && touched.bankName && errors.bankName}
                          error={errors.bankName && touched.bankName}
                          className={classes.textfieldWidth}
                        />
                      </div>
                      <div className={classes.formGroup}>
                        <TextField
                          id='balance'
                          name='balance'
                          type='number'
                          label='Balance'
                          value={values.balance}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          helperText={touched.balance && errors.balance}
                          error={errors.balance && touched.balance}
                          className={classes.textfieldWidth}
                        />
                      </div>
                    </div>
                  )}
                  {activeStep === 2 && (
                    <div>
                      <div className={classes.formGroup}>
                        <TextField
                          id='address'
                          name='address'
                          label='Address*'
                          value={values.address}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          helperText={errors.address && touched.address && errors.address}
                          error={errors.address && touched.address}
                          className={classes.textfieldWidth}
                        />
                      </div>
                      <div className={classes.formGroup}>
                        <TextField
                          id='description'
                          name='description'
                          label='Description'
                          value={values.description}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={classes.textfieldWidth}
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    {activeStep === steps.length ? (
                      <div className={classes.resetContainer}>
                        <Typography className={classes.instructions}>All steps completed</Typography>
                        <pre>
                          <p id='form__data'>myname islataf</p>
                        </pre>
                        <Button
                          variant='contained'
                          color='secondary'
                          onClick={() => {
                            handleReset();
                            setChecked(false);
                            setActiveStep(0);
                          }}
                        >
                          Reset
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Button variant='contained' disabled={activeStep === 0} onClick={handleBack} className={classes.backButton}>
                          Back
                        </Button>
                        <Button id='submit' disabled={isSubmitting} variant='contained' color='primary' type='submit'>
                          {isLastStep() ? 'Finish' : 'Next'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default MyForm;
