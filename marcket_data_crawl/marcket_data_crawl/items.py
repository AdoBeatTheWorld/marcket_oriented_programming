# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class MarcketDataCrawlItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    sub_class = scrapy.Field()
    sub_addr = scrapy.Field()
    pass
