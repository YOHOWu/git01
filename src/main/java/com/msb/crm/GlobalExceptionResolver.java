package com.msb.crm;

import com.alibaba.fastjson.JSON;
import com.msb.crm.base.ResultInfo;
import com.msb.crm.exceptions.AuthException;
import com.msb.crm.exceptions.NoLoginException;
import com.msb.crm.exceptions.ParamsException;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@Component
public class GlobalExceptionResolver implements HandlerExceptionResolver {
    @Override
    public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        /**
         * 非法请求拦截
         *   判断是否抛出未登录异常
         *      如果抛出该异常，则要求用户登录，重定向跳转到登录页面
         */
        if (ex instanceof NoLoginException){
            //重定向到登录页面
            ModelAndView mv=new ModelAndView("redirect:/index");
            return mv;
        }

        //设置默认异常处理(返回视图)
        ModelAndView modelAndView=new ModelAndView("error");
        //设置异常信息
        modelAndView.addObject("code",500);
        modelAndView.addObject("msg","系统异常，请稍后重试...");

        //判断HandlerMethod
        if (handler instanceof HandlerMethod){
            //类型转化
            HandlerMethod handlerMethod=(HandlerMethod)  handler;
            //获取方法上声明的@ResponseBody注解对象
            ResponseBody responseBody=handlerMethod.getMethod().getDeclaredAnnotation(ResponseBody.class);
            //判断ResponseBody对象是否为空（如果对象为空，则表示返回的是视图；如果不为空，则表示返回的是数据）
            if (responseBody==null){
                /**
                 * 方法返回视图
                 */
                //判断异常类型
                if (ex instanceof ParamsException){
                    ParamsException p=(ParamsException) ex;
                    //设置异常信息
                    modelAndView.addObject("code",p.getCode());
                    modelAndView.addObject("msg",p.getMsg());
                }else if (ex instanceof AuthException){     //认证异常
                    AuthException a=(AuthException) ex;
                    //设置异常信息
                    modelAndView.addObject("code",a.getCode());
                    modelAndView.addObject("msg",a.getMsg());
                }
                return modelAndView;
            } else {
                /**
                 * 方法返回数据
                 */
                //设置默认的异常处理
                ResultInfo resultInfo=new ResultInfo();
                resultInfo.setCode(500);
                resultInfo.setMsg("系统异常，请重试!...");

                //判断异常类型是否是自定义异常
                if (ex instanceof ParamsException){
                    ParamsException p=(ParamsException) ex;
                    resultInfo.setCode(p.getCode());
                    resultInfo.setMsg(p.getMsg());
                }else if (ex instanceof AuthException){   //认证异常
                    AuthException a=(AuthException) ex;
                    resultInfo.setCode(a.getCode());
                    resultInfo.setMsg(a.getMsg());
                }

                //设置响应类型及编码格式（响应JSON格式的数据）
                response.setContentType("application/json;charset=UTF-8");
                //得到字符输出流
                PrintWriter out=null;
                try {
                    //得到输出流
                    out=response.getWriter();
                    //将需要返回的对象转换成JSON格式的字符
                    String json= JSON.toJSONString(resultInfo);
                    //输出数据
                    out.write(json);
                } catch (IOException e) {
                    e.printStackTrace();
                }finally {
                    //如果对象不为空，则关闭
                    if (out!=null){
                        out.close();
                    }
                }
                return null;
            }
        }

        return modelAndView;
    }
}
