import{test,expect} from '@playwright/test';

/**
 * API Test Suite — Products Module
 * Site: automationexercise.com
 * TC_API_001: Get all products list
 * TC_API_002: Get all brands list
 * TC_API_003: Search product by keyword
 * TC_API_004: Search product with empty keyword (negative)
 */
test('TC_API_001 — Get all products list',async({request})=>{
    const res=  await request.get(`/api/productsList`);
    //response is successful
    expect(res.ok()).toBeTruthy();
    //status code 200
    expect(res.status()).toBe(200);
    const resJson = await res.json();
    console.log(resJson);
    //response has 'products' array
    expect(resJson.products).toBeDefined();
    expect(Array.isArray(resJson.products)).toBeTruthy();
    //products.length > 0
    const productsLength:number = resJson.products.length;
    expect(productsLength).toBeGreaterThan(0);
    //each product has: id, name, price, brand
    for(let i =0; i<productsLength ; i++){
    expect(resJson.products[i].id).toBeDefined();
    expect(resJson.products[i].name).toBeDefined();
    expect(resJson.products[i].price).toBeDefined();
    expect(resJson.products[i].brand).toBeDefined();
    }
})

test('TC_API_002 — Get all brands list',async({request})=>{
    const res=  await request.get(`/api/brandsList`);
    //response is successful
    expect(res.ok()).toBeTruthy();
    //status code 200
    expect(res.status()).toBe(200);
    const resJson = await res.json();
    console.log(resJson);
    //response has 'brands' array
    expect(resJson.brands).toBeDefined();
    expect(Array.isArray(resJson.brands)).toBeTruthy();
    //brands.length > 0
    const brandsLength:number = resJson.brands.length;
    expect(brandsLength).toBeGreaterThan(0);
    //each brand has: id,brand
    for(let i =0; i<brandsLength ; i++){
    expect(resJson.brands[i].id).toBeDefined();
    expect(resJson.brands[i].brand).toBeDefined();
    }
})

test('TC_API_003 — Search product by keyword',async({request})=>{
    const searchPayload = {search_product :'top'}
    const res=  await request.post(`/api/searchProduct`,{
        multipart:searchPayload
    });
    //response is successful
    expect(res.ok()).toBeTruthy();
    //status code 200
    expect(res.status()).toBe(200);
    const resJson = await res.json();
    console.log(resJson);
    //response has 'products' array
    expect(resJson.products).toBeDefined();
    expect(Array.isArray(resJson.products)).toBeTruthy();
    //products.length > 0
    const productsLength:number = resJson.products.length;
    expect(productsLength).toBeGreaterThan(0);
})

test('TC_API_004 — Search product with no keyword ',async({request})=>{
    const searchPayload = { search_product:'' };
    const res=  await request.post(`/api/searchProduct`,{
        multipart:searchPayload
    });
    const resJson = await res.json();
    console.log(resJson);
    //status code 400
    expect(resJson.responseCode).toBe(400);
    //response message = "Bad request, search_product parameter is missing in POST request."
    expect(resJson.message).toContain('Bad request, search_product parameter is missing in POST request.')
})