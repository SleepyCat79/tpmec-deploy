##drop schema TPM_EC;
create schema TPM_EC;

USE TPM_EC;


CREATE TABLE USER (
		User_ID VARCHAR(255) unique not null,
		Phone_Number CHAR(10),
		FName VARCHAR(50),
		LName VARCHAR(50),
		Date_of_birth DATE,
		Email VARCHAR(100) unique not null,
		IsSeller BOOLEAN ,
        Shop_name VARCHAR(255)
);

CREATE TABLE USER_ADDRESS(
		Address VARCHAR(255),
        User_ID VARCHAR(255),
        foreign key(User_ID) references USER(User_ID)
);

CREATE TABLE PRODUCT(
		Product_ID INT AUTO_INCREMENT PRIMARY KEY,
        Seller_ID VARCHAR(255),
        Product_title VARCHAR(255),
        Product_description VARCHAR(255),
        foreign key(Seller_ID) references USER(User_ID)
);

CREATE TABLE PRODUCT_OPTION(
		Product_ID INT,
        Option_name varchar (255),
        Option_price DECIMAL(10,2),
        Option_number INT,
        IsValid boolean,
        primary key(Product_ID,Option_number),
        foreign key(Product_ID) references PRODUCT(Product_ID) on delete cascade
);

CREATE TABLE PRODUCT_IMAGE(
		Product_ID INT,
        Image_url VARCHAR(255),
        primary key(Product_ID,Image_url),
        foreign key(Product_ID) references PRODUCT(Product_ID) on delete cascade
);

CREATE TABLE PRODCUT_RATING(
		Product_ID INT,
        User_ID varchar(255),
        Rate_value INT,
        foreign key (Product_ID) references PRODUCT(Product_ID) on delete cascade,
        foreign key (User_ID) references USER(User_ID) on delete cascade
);

CREATE TABLE PRODUCT_LIKED(
		Product_ID INT,
        User_ID varchar(255),
        foreign key (Product_ID) references PRODUCT(Product_ID) on delete cascade,
        foreign key (User_ID) references USER(User_ID) on delete cascade
);

CREATE TABLE USER_CART(
		Product_ID INT,
        User_ID varchar(255),
        Quantity INT,
        Option_number INT,
		foreign key (Product_ID) references PRODUCT(Product_ID) on delete cascade,
        foreign key (User_ID) references USER(User_ID) on delete cascade,
        primary key(User_ID,Product_ID,Option_number)
);

CREATE TABLE ORDER_TABLE(
		Order_ID INT AUTO_INCREMENT PRIMARY KEY,
        Seller_ID varchar(255) not null,
        Customer_ID varchar(255) not null,
        Address varchar(255) not null,
        Total_price decimal(10,2),
        Total_quantity INT,
        Ship_code varchar(255),
        Order_date DATE,
        Expected_delivery_date DATE,
        Shipping_company varchar(255),
        Status Enum('Waiting confirmation','Packiging','Shipping','Complete','Reject'),
        foreign key (Seller_ID) references USER(User_ID),
        foreign key (Customer_ID) references USER(User_ID)
);

CREATE TABLE ORDER_ITEM(
		Order_ID INT,
        Product_ID INT,
        Option_number INT,
        Quantity INT,
        Discount_percentage DECIMAL(10,2),
        Original_price DECIMAL(10,2),
        Final_price DECIMAL(10,2)
);



CREATE TABLE SHIPPING_COMPANY (
		Seller_ID varchar(255),
        Company_name varchar(255) ,
        foreign key (Seller_ID) references USER(User_ID)
);

ALTER TABLE PRODUCT ADD FULLTEXT (Product_title,Product_description)
## PROCEDURE FOR USER

DELIMITER $$

CREATE PROCEDURE Insert_User_Information(
    IN p_User_ID VARCHAR(255),
    IN p_Phone_Number CHAR(10),
    IN p_Email VARCHAR(100),
    IN p_FName VARCHAR(50),
    IN p_LName VARCHAR(50),
    IN p_Date_of_birth DATE
)
BEGIN
    INSERT INTO USER (User_ID, Phone_Number, Email, FName, LName, Date_of_birth, IsSeller, Shop_name)
    VALUES (p_User_ID, p_Phone_Number, p_Email, p_FName, p_LName, p_Date_of_birth, FALSE, NULL);
END $$

DELIMITER ;

##CALL Insert_User_Information('user_id_value', '0798944343', 'email@example.com', 'FirstName', 'LastName', '2004-10-09');


#CALL Insert_User_Address('user_id_value','address 3');



##drop procedure if exists Get_User_Information
DELIMITER $$

CREATE PROCEDURE Get_User_Information(IN p_user_id VARCHAR(255))
BEGIN
    SELECT 
        u.*,
        COALESCE(SUM(c.Quantity), 0) AS Total_Quantity
    FROM 
        USER u
    LEFT JOIN 
        USER_CART c ON u.User_ID = c.User_ID
    WHERE 
        u.User_ID = p_user_id
    GROUP BY 
        u.User_ID;
END $$

DELIMITER ;
##call Get_User_Information('user_id_value');



## procedure update user information
DELIMITER $$

CREATE PROCEDURE Update_User_Information(
    IN p_User_ID VARCHAR(255),
    IN p_Phone_Number CHAR(10),
    IN p_Email VARCHAR(100),
    IN p_FName VARCHAR(50),
    IN p_LName VARCHAR(50),
    IN p_Date_of_birth DATE
)
BEGIN
    UPDATE USER
    SET Phone_Number = p_Phone_Number,
        Email = p_Email,
        FName = p_FName,
        LName = p_LName,
        Date_of_birth = p_Date_of_birth
    WHERE User_ID = p_User_ID;
END $$

DELIMITER ;

#CALL Update_User_Information('user_id_value', '0908916135', 'emailChange@example.com', 'FirstName', 'LastName', '2004-04-24');

## procedure insert product
drop procedure if exists Add_Product
DELIMITER $$

CREATE PROCEDURE Add_Product(
    IN p_Seller_ID VARCHAR(255),
    IN p_Product_Title VARCHAR(255),
    IN p_Product_Description VARCHAR(255)
)
BEGIN
    INSERT INTO PRODUCT (Seller_ID, Product_title, Product_description)
    VALUES (p_Seller_ID, p_Product_Title, p_Product_Description);
END $$

DELIMITER ;

## procedure insert product option
DELIMITER $$

CREATE PROCEDURE Add_Product_Option(
    IN p_Product_ID INT,
    IN p_Option_Name VARCHAR(255),
    IN p_Option_Price DECIMAL(10,2),
    IN p_Option_Number INT
)
BEGIN
    INSERT INTO PRODUCT_OPTION (Product_ID, Option_name, Option_price, Option_number, IsValid)
    VALUES (p_Product_ID, p_Option_Name, p_Option_Price, p_Option_Number, TRUE);
END $$

DELIMITER ;

## procedure insert product image

DELIMITER $$

CREATE PROCEDURE Add_Product_Image(
    IN p_Product_ID INT,
    IN p_Image_Url VARCHAR(255)
)
BEGIN
    INSERT INTO PRODUCT_IMAGE (Product_ID, Image_url)
    VALUES (p_Product_ID,p_Image_Url);
END $$

DELIMITER ;

##procedure for adding product to cart
DELIMITER $$

CREATE PROCEDURE Add_To_Cart(
    IN p_Product_ID INT,
    IN p_User_ID VARCHAR(255),
    IN p_Option_Number INT,
    IN p_Quantity INT
)
BEGIN
    -- Check if the item with the specific option is already in the cart
    IF EXISTS (
        SELECT 1
        FROM USER_CART
        WHERE Product_ID = p_Product_ID
        AND User_ID = p_User_ID
        AND Option_number = p_Option_Number
    ) THEN
        -- Update the quantity if the item exists
        UPDATE USER_CART
        SET Quantity = Quantity + p_Quantity
        WHERE Product_ID = p_Product_ID
        AND User_ID = p_User_ID
        AND Option_number = p_Option_Number;
    ELSE
        -- Insert new record if the item does not exist
        INSERT INTO USER_CART (Product_ID, User_ID, Option_number, Quantity)
        VALUES (p_Product_ID, p_User_ID, p_Option_Number, p_Quantity);
    END IF;
END $$

DELIMITER ;

## procedure for delete product out of cart
DELIMITER $$

CREATE PROCEDURE Remove_From_Cart(
    IN p_Product_ID INT,
    IN p_User_ID VARCHAR(255),
    IN p_Option_Number INT
)
BEGIN
    DELETE FROM USER_CART
    WHERE Product_ID = p_Product_ID
      AND User_ID = p_User_ID
      AND Option_number = p_Option_Number;
END $$

DELIMITER ;


##procedure for update value of quantity of product in cart
DELIMITER $$

CREATE PROCEDURE Update_Cart_Quantity(
    IN p_Product_ID INT,
    IN p_User_ID VARCHAR(255),
    IN p_Option_Number INT,
    IN p_Quantity INT
)
BEGIN
    -- Check if the quantity is more than 0, then update; otherwise, delete the entry
    IF p_Quantity > 0 THEN
        UPDATE USER_CART
        SET Quantity = p_Quantity
        WHERE Product_ID = p_Product_ID
          AND User_ID = p_User_ID
          AND Option_Number = p_Option_Number;
    ELSE
        DELETE FROM USER_CART
        WHERE Product_ID = p_Product_ID
          AND User_ID = p_User_ID
          AND Option_Number = p_Option_Number;
    END IF;
END $$

DELIMITER ;


#procedure get list product
DELIMITER $$

CREATE PROCEDURE Get_All_Products_For_User()
BEGIN
    SELECT 
        p.Product_ID,
        p.Seller_ID,
        p.Product_title,
        p.Product_description,
        MIN(po.Option_price) AS First_Option_Price,
        MIN(pi.Image_url) AS First_Image
    FROM PRODUCT p
    LEFT JOIN PRODUCT_OPTION po ON p.Product_ID = po.Product_ID AND po.IsValid = TRUE
    LEFT JOIN PRODUCT_IMAGE pi ON p.Product_ID = pi.Product_ID
    GROUP BY p.Product_ID;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE Get_Cart(IN p_User_ID VARCHAR(255))
BEGIN
    SELECT 
        uc.User_ID,
        uc.Product_ID,
        uc.Quantity,
        uc.Option_number,
        p.Seller_ID,
        p.Product_title,
        p.Product_description,
        po.Option_name,
        po.Option_price,
        po.IsValid,
        (SELECT Image_url FROM PRODUCT_IMAGE WHERE Product_ID = p.Product_ID LIMIT 1) as Image_url
    FROM USER_CART uc
    INNER JOIN PRODUCT p ON uc.Product_ID = p.Product_ID
    LEFT JOIN PRODUCT_OPTION po ON p.Product_ID = po.Product_ID AND uc.Option_number = po.Option_number
    WHERE uc.User_ID = p_User_ID;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE Get_All_Product_For_Seller(
    IN p_Seller_ID VARCHAR(255)
)
BEGIN
    SELECT 
        p.Product_ID,
        p.Seller_ID,
        p.Product_title,
        p.Product_description,
        MIN(pi.Image_url) AS Image_url  -- Using MIN() to get the first image URL
    FROM PRODUCT p
    LEFT JOIN PRODUCT_IMAGE pi ON p.Product_ID = pi.Product_ID
    WHERE p.Seller_ID = p_Seller_ID
    GROUP BY p.Product_ID;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE `TPM_EC`.`getOrderDetails`(
    IN p_Order_ID INT
)
BEGIN
    SELECT * FROM ORDER_ITEM WHERE Order_ID = p_Order_ID;
END $$

DELIMITER ;

## procedure for searching

DELIMITER $$

CREATE PROCEDURE searchProduct(IN p_product_name VARCHAR(255))
BEGIN
    SELECT 
        p.Product_ID,
        p.Seller_ID,
        p.Product_title,
        p.Product_description,
        MIN(po.Option_price) AS First_Option_Price,
        MIN(pi.Image_url) AS First_Image
    FROM PRODUCT p
    LEFT JOIN PRODUCT_OPTION po ON p.Product_ID = po.Product_ID AND po.IsValid = TRUE
    LEFT JOIN PRODUCT_IMAGE pi ON p.Product_ID = pi.Product_ID
    WHERE p.Product_title LIKE CONCAT('%', p_product_name, '%')
       OR p.Product_description LIKE CONCAT('%', p_product_name, '%')
    GROUP BY p.Product_ID;
END$$

DELIMITER ;

call searchProduct('apple');

## procedure get all product of shop

DELIMITER $$

CREATE PROCEDURE Get_all_product_of_seller_for_user(IN p_seller_ID VARCHAR(255))
BEGIN
    SELECT 
        p.Product_ID,
        p.Seller_ID,
        p.Product_title,
        p.Product_description,
        MIN(po.Option_price) AS First_Option_Price,
        MIN(pi.Image_url) AS First_Image
    FROM PRODUCT p
    LEFT JOIN PRODUCT_OPTION po ON p.Product_ID = po.Product_ID AND po.IsValid = TRUE
    LEFT JOIN PRODUCT_IMAGE pi ON p.Product_ID = pi.Product_ID
    WHERE p.Seller_ID = p_seller_ID
    GROUP BY p.Product_ID;
END $$

DELIMITER ;

## procedure for create order
## moi them 8/5/2024
DELIMITER $$

CREATE DEFINER=`admin`@`%` PROCEDURE `createOrder`(
    IN Seller_ID VARCHAR(255),
    IN Customer_ID VARCHAR(255),
    IN Address VARCHAR(255),
    IN Shipping_company VARCHAR(255),
    IN Total_quantity INT,
    IN Order_date DATE
)
BEGIN
    INSERT INTO ORDER_TABLE (
        Seller_ID,
        Customer_ID,
        Address,
        Shipping_company,
        Total_quantity,
        Order_date,
        Status
    ) VALUES (
        Seller_ID,
        Customer_ID,
        Address,
        Shipping_company,
        Total_quantity,
        Order_date,
        'Waiting confirmation'
    );

    SELECT LAST_INSERT_ID() as Order_ID;  -- Return the ID of the inserted order
END$$

DELIMITER ;



DELIMITER $$

CREATE PROCEDURE createOrderDetails(
    IN p_Order_ID INT,
    IN p_Product_ID INT,
    IN p_Option_number INT,
    IN p_Quantity INT,
    IN p_Discount_percentage DECIMAL(10,2),
    IN p_Original_price DECIMAL(10,2)
)
BEGIN
    DECLARE v_Final_price DECIMAL(10,2);

    -- Calculate the final price
    SET v_Final_price = (1 - p_Discount_percentage / 100) * p_Original_price * p_Quantity;

    -- Insert the order item into ORDER_ITEM table
    INSERT INTO ORDER_ITEM (
        Order_ID,
        Product_ID,
        Option_number,
        Quantity,
        Discount_percentage,
        Original_price,
        Final_price
    ) VALUES (
        p_Order_ID,
        p_Product_ID,
        p_Option_number,
        p_Quantity,
        p_Discount_percentage,
        p_Original_price,
        v_Final_price
    );
END$$

DELIMITER ;

## TRIGGER after insert order item we update the total price in ORDER_TABLE
DELIMITER $$

CREATE TRIGGER AfterInsertOrderItem
AFTER INSERT ON ORDER_ITEM
FOR EACH ROW
BEGIN
    -- Update the total price in the ORDER_TABLE
    UPDATE ORDER_TABLE
    SET Total_price = COALESCE(Total_price, 0) + NEW.Final_price
    WHERE Order_ID = NEW.Order_ID;
END$$

DELIMITER ;
