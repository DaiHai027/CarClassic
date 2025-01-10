import { useFormik } from "formik";
import * as Yup from 'yup'
import styles from './index.module.scss'
import { postContactUsDetailsApi } from "@/apiConfig/services";
import { useState } from "react";
import { LANGAUGE, LOCAL_STORAGE } from "@/constant";

import loader from '../../public/Loadertransparent.gif'



const GeneralForm = ({ className, data, privacyPolicySection }) => {
    const [response, setResponse] = useState({});

    const fields = [
        {
            name: "fullName",
            type: "text",
            id: "fullName",
            placeholder: 'Uw naam',
            label: data?.contactnamelabel || "Uw naam (verplicht)"
        },
        {
            name: "email",
            type: "email",
            id: "email",
            placeholder: "E-mailadres",
            label: data?.contactEmailLabel || "E-mailadres (verplicht)"
        },
        {
            name: "phoneNumber",
            type: "number",
            id: "phoneNumber",
            placeholder: "Telefoonnummer",
            label: data?.contactPhoneNumberLabel || "Telefoonnummer (optioneel)"
        }
    ]

    const handleOnSubmit = async (values) => {
        setResponse({ isLoading: true });
        try {
            const langCode = localStorage?.getItem(LOCAL_STORAGE.LANGUAGE_KEY) || LANGAUGE.DEFAULT_LANGUAGE_CODE
            const response = await postContactUsDetailsApi({ ...values, langCode });
            setResponse({ message: response.message || "Form submitted successflly", success: true });
            resetForm()
            setTimeout(() => {
                setResponse({})
            }, 5000)
        } catch (error) {
            setResponse({ message: error || "Somthing went wrong!!", success: false });
            resetForm()
            setTimeout(() => {
                setResponse({})
            }, 5000)
        }
    }
    const { values, errors, handleBlur, handleChange, handleSubmit, resetForm, getFieldProps, touched, setFieldValue } = useFormik({
        initialValues: {
            fullName: "",
            email: "",
            message: "",
            phoneNumber: "",
            privacyPolicyAgree: false
        },
        validationSchema: Yup.object().shape({
            email: Yup.string()
                .email("Please type a valid Email")
                .required("E-mail is vereist"),
            fullName: Yup.string()
                .matches(/^[A-Za-z ]+$/, 'Full name must contain only letters and spaces')
                .required('Volledige naam is vereist'),
            message: Yup.string().required("Bericht of vraag is vereist"),
            phoneNumber: Yup.string(),
            privacyPolicyAgree: Yup.boolean().oneOf([true], "Ik ga akkoord met de privacyverklaring vereist"),

        }),
        onSubmit: handleOnSubmit
    })


    return (
        <form action={handleSubmit} className={className}>
            {
                fields?.map(({ name, id, type, placeholder, label }, index) => {
                    return (
                        <div class={`${styles.form__group} ${errors[name] && touched[name] ? 'error' : ''}`} key={index}>
                            <input
                                autoComplete='off'
                                class={`${styles.form__field}`}
                                placeholder={placeholder}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values[name]}
                                name={name}
                                id={id}
                                type={type}
                            />
                            <label for={id} class={`${styles.form__label}`}>{label}</label>
                            <span>{errors[name] && touched[name] && errors[name]}</span>
                        </div>
                    )
                })
            }
            <div className={`${styles.form__group} ${styles.w100} ${errors.message && touched.message ? 'error' : ''}`}>
                <textarea autoComplete='off' id="vraag" class={`${styles.form__field}`} rows="1" name='message' placeholder="Uw bericht/vraag" onChange={(e) => {
                    e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px";
                    handleChange(e)

                }} onBlur={handleBlur} value={values.message} />
                <label for="vraag" class={`${styles.form__label}`}>{data?.contactMessageLabel || "Uw bericht/vraag"}</label>
                <span>{errors.message && touched.message && errors.message}</span>
            </div>
            <div className="PrivacyPolicy ">
                <label class="checkBoxcontainer">
                    <input type="checkbox"
                        checked={values?.privacyPolicyAgree}
                        name="privacyPolicyAgree"
                        onChange={(e) => { setFieldValue('privacyPolicyAgree', e.target.checked) }}
                    />
                    <span class="checkmark"></span>
                </label>
                {privacyPolicySection ? <p>{privacyPolicySection?.privacyPolicyText} {privacyPolicySection?.privacyPolicyPdf?.node?.mediaItemUrl ? <a href={privacyPolicySection?.privacyPolicyPdf?.node?.mediaItemUrl} target="_blank">{privacyPolicySection?.privacyPolicyUrlText}</a> : null}</p> : null}
                {touched['privacyPolicyAgree'] && errors['privacyPolicyAgree'] ? <span className="errors">{errors['privacyPolicyAgree']}</span> : null}
            </div>

            <div className={styles["btn-wrapper"]}>
                <button type='submit' class="btn">{data?.contactFormSendButton}</button>
            </div>
            {
                response.isLoading ?
                    <span className="loader"><img src={loader.src} alt="" /></span> : null
            }
        </form >
    )
}
export default GeneralForm;