package com.ca.soapws.example;

import org.tempuri.CalculatorLocator;
import org.tempuri.CalculatorSoap;

public class SOAPWebServiceHandler {

	public static void main(String[] args) throws Exception {
		System.out.println(calc(10, 2));
		System.out.println(calc(10, 5));
		System.out.println(calc(20, 10));
		System.out.println(calc(20, 3));
		
	}
	
	public static String calc(int a, int b){
		if(a%b!=0) {
			return "{\"response\":\"invalid input\"}";
		}
		StringBuffer sb = new StringBuffer();
		try {
			sb.append("{\n\t\"add\":" + add(a, b)+",\n");
			sb.append("\t\"sub\":" + subtract(a, b)+",\n");
			sb.append("\t\"mul\":" + multiply(a, b)+",\n");
			sb.append("\t\"div\":" + divide(a, b) +"\n"+"}");
		} catch (Exception e) {
			e.printStackTrace();
			return "{\"error\":\""+e.getMessage()+"\"}";
		}
		return sb.toString();
	}
	private static int add(int a,int b) throws Exception {
		CalculatorLocator locator =  new CalculatorLocator();
		CalculatorSoap calc = locator.getCalculatorSoap();
		int response = calc.add(a, b);
		return response;
	}
	private static int divide(int a,int b) throws Exception {
		CalculatorLocator locator =  new CalculatorLocator();
		CalculatorSoap calc = locator.getCalculatorSoap();
		int response = calc.divide(a, b);
		return response;
	}

	private static int multiply(int a,int b) throws Exception {
		CalculatorLocator locator =  new CalculatorLocator();
		CalculatorSoap calc = locator.getCalculatorSoap();
		int response = calc.multiply(a, b);
		return response;
	}
	
	private static int subtract(int a,int b) throws Exception {
		CalculatorLocator locator =  new CalculatorLocator();
		CalculatorSoap calc = locator.getCalculatorSoap();
		int response = calc.subtract(a, b);
		return response;
	}
}
