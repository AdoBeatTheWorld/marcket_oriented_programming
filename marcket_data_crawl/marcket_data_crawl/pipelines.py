# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/en/latest/topics/item-pipeline.html
import codecs

reload(sys)
sys.setDefaultencoding('utf8')

class MarcketDataCrawlPipeline(object):
	def __init__(self):
		self.file = codecs.open('marcket_data_crawl.json', mode='wb', encoding='utf-8')
		pass
    def process_item(self, item, spider):
        line = 'this is the new data:'+'\n'
        return item
    def close_spider(self, spider):
    	self.file.close()
    	pass