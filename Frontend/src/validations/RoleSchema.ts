import * as Yup from 'yup';

export const RoleSchema = Yup.object().shape({
    name: Yup.string()
        .required('Role name is required')
        .matches(/^[A-Z][a-zA-Z]{2,}$/, 'Role name must start with a capital letter and be at least 3 letters long, containing only letters'),

    description: Yup.string().nullable(),
});
