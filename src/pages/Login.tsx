import { Button } from "@/components/ui/button"
import { Field,  FieldError,  FieldGroup, FieldLabel,  FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, LucideLoader2 } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import {AxiosError} from 'axios'
import { authApiEndPoints, axiosInstance } from "@/api/api"
import { useMutation,  useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useContext, useDebugValue, useState } from "react"
import { UserContext } from "@/context/userContext"

export const LoginPage = ()=>{
    const [isPassword,setIsPassword] = useState(true)
    const [errors,setErrors] = useState<any>({})
    const userContext = useContext(UserContext)
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationKey:['loginUser'],
        mutationFn: async (formData:object)=>{
            console.log('user')
            console.log(formData)
            toast.loading('Login user please wait',{position:'top-center',id:'11',style:{color:'black',fontWeight:'bold',fontSize:'medium'}})
            
            const response = await axiosInstance.post(authApiEndPoints.login,formData,{headers:{"Content-Type":'application/json'}})
            return response.data
        },
        onSuccess(data) {
            console.log('Logged In successful:', data);
            queryClient.invalidateQueries({ queryKey: ['user'] });
            toast.success('Logged successfully',{position:'top-center',id:'11',style:{color:'green',fontWeight:'bold',fontSize:'medium'}})
            userContext?.login(data.accessToken,data.user)
            navigate('/dashboard')
        },
        onError(error: AxiosError<any>) {
            if(error.status === 400){
                if(typeof error.response?.data.message === 'string' ){
                    toast.error(error.response.data.message,{position:'top-center',id:'11',style:{color:'red',fontWeight:'bold',fontSize:'medium'}})
                    return
                }
                const errors = mapHelperError(error.response?.data['message'])
                
                console.log(errors)
                setErrors(errors)

            }

            if(error.status === 404){
                setErrors({email:error.response?.data.message})
            }
            toast.error(error?.message,{position:'top-center',id:'11'})
        },
    })

    function mapHelperError(errors:string[]){
        let errorMap:any = {};
        for (const error of errors) {
            if(error.startsWith('firstname') && !errorMap.firstname){
                errorMap = {...errorMap,firstname: error}
            }else if(error.startsWith('lastname') && !errorMap.lastname){
                errorMap = {...errorMap,lastname: error}
            }else if(error.startsWith('email')&& !errorMap.email){
                errorMap = {...errorMap,email:error}
            }else if(error.startsWith('password') && !errorMap.password){
                errorMap = {...errorMap,password:error}
            }else{
                errorMap = {...errorMap,global:error}
            }
        }
        return errorMap
    }

    const navigate = useNavigate()

    async function handleSubmit(e:React.SubmitEvent<HTMLFormElement>){
        e.preventDefault();

        const formData = new FormData(e.target)
        console.log(formData)
        const data = Object.fromEntries(formData.entries())

        mutation.mutate(data)

    }

    return <>
        <form className="max-w-[500px] bg-(--auth-card) mx-auto px-4 rounded-lg p-10 mt-15 border-(--border) border"  onSubmit={handleSubmit}>
            <div className="text-center mb-6 space-y-3">
                <h2 className="text-3xl dark:text-white font-bold mt-10">Welcome Back</h2>
                <p className="dark:text-(--text-4) text-[#6b7a90]"> Log in to your TaskFlow account to continue collaborating.</p>
            </div>

            {/* fields */}
            <FieldSet>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="email">Email Address</FieldLabel>
                        <Input id="email" className="dark:bg-(--input-secondary) dark:placeholder:text-(--text-4)" name="email" autoComplete="off" placeholder="jane.doe@company.com"/>
                        <FieldError>{errors['email']}</FieldError>
                    </Field>
                    <Field>
                        <div className="flex justify-between">
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Link className="text-(--link-primary)" to={'/forgot-password'}>Forgot Password?</Link>
                        </div>
                        <div className="flex ">
                            <Input type={isPassword?'password':"text"} className="dark:bg-(--input-secondary) dark:placeholder:text-(--text-4)" id="password" name="password" placeholder="Enter Your Password" autoComplete="off" />
                            <Button variant={"ghost"} type="button" onClick={()=>setIsPassword(!isPassword)}>
                            {isPassword?<Eye/>:<EyeOff/>}  
                            </Button>
                        </div>
                        <FieldError>{errors['password']}</FieldError>
                    </Field>
                </FieldGroup>
                <Button variant={'defaultYellow'} disabled={mutation.isPending} className="p-6 cursor-pointer font-bold text-white">
                    Login {mutation.isPending&&<LucideLoader2 className="animate-spin"/>}
                </Button>
            </FieldSet>
            <p className="text-center mt-2"> Don't have an account? 
                <Button variant={"link"}>
                    <Link className="text-(--link-primary)" to={'/signup'}>Sign up</Link> 
                </Button>
            </p>
        </form>
    </>
} 