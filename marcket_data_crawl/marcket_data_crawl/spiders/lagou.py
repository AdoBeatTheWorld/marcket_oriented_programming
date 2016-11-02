# -*- coding: utf-8 -*-
import scrapy
from scrapy.selector import Selector
from scrapy.spiders import Spider
from marcket_data_crawl.items import MarcketDataCrawlItem

class LagouSpider(scrapy.Spider):
    name = "lagou"
    allowed_domains = ["lagou.com"]
    start_urls = (
        'https://www.lagou.com/',
    )

    def parse(self, response):
    	sel = Selector(response)
    	sub_class = sel.xpath("//div[@class='menu_main job_hopping']/a/text()").extract()
    	sub_addr = sel.xpath("//div[@class='menu_main job_hopping']/a/@href()").extrace()
    	
        item = MarcketDataCrawlItem()
        item['sub_class'] = sub_class
        item['sub_addr'] = sub_addr
        yield item
        print sub_class, sub_addr
