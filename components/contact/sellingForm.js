import { useMemo, useState } from "react";
import * as Yup from 'yup'
import { useFormik } from "formik";
import { postSellCarDetails } from "@/apiConfig/services";
import { LANGAUGE, LOCAL_STORAGE } from "@/constant";
import styles from './index.module.scss'
import CloseBtn from '../../public/closeBtn.svg'

import loader from '../../public/Loadertransparent.gif'

const SellingForm = ({ className, data, privacyPolicySection }) => {
    const [imageSrc, setImageSrc] = useState('');
    const [response, setResponse] = useState({});
    const [multipleFile, setMultipleFile] = useState([]);
    const fields = [
        {
            name: "fullName",
            type: "text",
            id: "fullName",
            placeholder: 'Uw naam',
            label: data?.sellingNameLabel || "Uw naam (verplicht)"
        },
        {
            name: "email",
            type: "email",
            id: "email",
            placeholder: "E-mailadres",
            label: data?.sellingEmailLabel || "E-mailadres (verplicht)"
        },
        {
            name: "phoneNumber",
            type: "phoneNumber",
            id: "phoneN,umber",
            placeholder: "Telefoonnummer",
            label: data?.sellingPhoneLabel || "Telefoonnummer (optioneel)"
        },
        {
            name: "placeName",
            type: "text",
            id: "placeName",
            placeholder: "Plaatsnaam",
            label: data?.placeLabel || "Plaatsnaam (verplicht)"
        },
        {
            name: "licenseNumber",
            type: "text",
            id: "licenseNumber",
            placeholder: "Kenteken",
            label: data?.licenseLabel || "Kenteken invoeren (verplicht)"
        }
    ]
    const handleOnSubmit = async (values) => {
        setResponse({ isLoading: true });
        const langCode = localStorage?.getItem(LOCAL_STORAGE.LANGUAGE_KEY) || LANGAUGE.DEFAULT_LANGUAGE_CODE
        try {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                if (value) {
                    formData.append(key, value);
                }
            });
            formData.append('langCode', langCode)
            multipleFile?.forEach((file) => {
                formData.append('images[]', file, file.name);
            })
            formData.append('images', multipleFile)
            const response = await postSellCarDetails(formData);
            setResponse({ message: response.message || "Form submitted successflly", success: true });
            setMultipleFile([])
            resetForm()
            setTimeout(() => {
                setResponse({})
            }, 5000)
            return
        } catch (error) {
            setMultipleFile([])
            setResponse({ message: error.message || "Somthing went wrong!!", success: false });
            resetForm()
            setTimeout(() => {
                setResponse({})
            }, 5000)
        }
    }
    const { values, errors, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm, touched, setFieldTouched } = useFormik({
        initialValues: {
            fullName: "",
            email: "",
            placeName: "",
            phoneNumber: "",
            licenseNumber: "",
            image: "",
            message: '',
            privacyPolicyAgree: false

        },
        validationSchema: Yup.object().shape({
            email: Yup.string()
                .email("Please type a valid Email")
                .required("E-mail is vereist"),
            fullName: Yup.string()
                .matches(/^[A-Za-z ]+$/, 'Full name must contain only letters and spaces')
                .required('Volledige naam is vereist'),
            licenseNumber: Yup.string()
                // .matches(/^\d{3}-\d{4}$/, 'License number must be in the format "XXX-XXXX"')
                .required('Licentienummer is vereist'),
            // image: Yup.array().required('Afbeelding is vereist').min(1,"Afbeelding is vereist"),
            phoneNumber: Yup.string(),
            placeName: Yup.string().required('Plaatsnaam is vereist'),
            message: Yup.string().required('Bericht of vraag is vereist'),
            privacyPolicyAgree: Yup.boolean().oneOf([true], "Ik ga akkoord met de privacyverklaring vereist"),


        }),
        onSubmit: handleOnSubmit
    })
    function uploadMultipleFiles(e) {
        const files = Array.from(e.target.files);
        setMultipleFile((prevFiles) => [...prevFiles, ...files]);
        setFieldTouched('image', true);
    };
    const removeImage = (index) => {
        setMultipleFile((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };
    const imageUrls = useMemo(() => {
        setFieldValue('image', multipleFile);
        return multipleFile.map((file) => URL.createObjectURL(file));
    }, [multipleFile]);


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
            <div className={`${styles.form__group} ${styles.w100}`}>
                <div className={styles.tb_container}>
                    <div className={styles.tb_img_view}>
                        <img id="tb-image" src={imageSrc} style={{ display: imageSrc ? 'block' : 'none' }} />
                    </div>
                    <label htmlFor="tb-file-upload">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="27" viewBox="0 0 28 27" fill="none"><path d="M3.6744 26.7497C2.92873 26.7497 2.29039 26.4842 1.75939 25.9532C1.22839 25.4222 0.962891 24.7838 0.962891 24.0382V3.96134C0.962891 3.21566 1.22839 2.57733 1.75939 2.04633C2.29039 1.5153 2.92873 1.24979 3.6744 1.24979H16.7128V3.49975H3.6744C3.53978 3.49975 3.42919 3.54302 3.34264 3.62957C3.25609 3.71612 3.21282 3.82671 3.21282 3.96134V24.0382C3.21282 24.1728 3.25609 24.2834 3.34264 24.3699C3.42919 24.4565 3.53978 24.4998 3.6744 24.4998H23.7513C23.8859 24.4998 23.9965 24.4565 24.083 24.3699C24.1695 24.2834 24.2128 24.1728 24.2128 24.0382V10.9998H26.4628V24.0382C26.4628 24.7838 26.1973 25.4222 25.6662 25.9532C25.1352 26.4842 24.4969 26.7497 23.7513 26.7497H3.6744ZM21.7898 8.92278V5.92278H18.7898V3.67285H21.7898V0.672852H24.0397V3.67285H27.0397V5.92278H24.0397V8.92278H21.7898ZM5.83789 21.1247H21.7031L16.7705 14.5478L12.559 20.0286L9.55902 16.1921L5.83789 21.1247Z" fill="#B5B5B5" /></svg>
                        <span>{data?.imageLabel}</span><span>{data?.maxSizeLabel}</span>
                    </label>
                    <input type="file" id="tb-file-upload" accept="image/*" onClick={() => setFieldTouched("image", true)} name="image" onBlur={handleBlur} onChange={uploadMultipleFiles} multiple />
                </div>
                <span>{errors["image"] && touched["image"] && errors["image"]}</span>
            </div>
            <div className="imageContainerThumbsBlock">

                <div className="imageContainerThumbs">
                    {
                        imageUrls.map((item, index) => {
                            return index <= 4 ?
                                <div className="imgWrapper">
                                    <div className="closebtn" onClick={() => removeImage(index)}>
                                        <CloseBtn />
                                    </div>
                                    <img src={item} alt="" />
                                </div> : null
                        })
                    }
                </div>
            </div>
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
                <button type='submit' class="btn">{data?.sellingButtonText}</button>
                {
                    response.isLoading ?
                        <span className="loader"><img src={loader.src} alt="" /></span> : null
                }
                <span></span>
            </div>
            <span className="successMessage">{response.message}</span>
        </form >

    )
}
export default SellingForm;